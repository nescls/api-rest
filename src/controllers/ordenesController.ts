import { OrdenProductos, PrismaClient } from '@prisma/client';
import { Producto } from '@prisma/client';
import { Request, Response } from 'express';
import { ExtendedRequest, CompraProductos } from '../common/types'; // Interfaz posiblemente definiendo la estructura de OrdenProducto
import { errorLogger } from '../config/loggerConfig';

const prisma = new PrismaClient();

async function createOrden(req: ExtendedRequest, res: Response) {
    try {
        const { tipoOrden, productos, direccion } = req.body;
        const idUsuario = req.user?.rol != 2 ? req.user?.id : req.body.idUsuario; // Si el usuario es administrador puede generar ordenes para otros usuarios

        if (!tipoOrden || !productos) {
            return res.status(400).json({ error: 'Faltan campos obligatorios: idUsuario, tipoOrden, productos' });
        }

        if (tipoOrden === 'delivery' && !direccion) {
            return res.status(400).json({ error: 'La dirección es obligatoria para pedidos a domicilio' });
        }

        const idsProductos = productos.map((producto: CompraProductos) => producto.id); // Extrae el id de los productos

        const productosDisponibles = await prisma.producto.findMany({
            where: {
                id: { in: idsProductos }, // Traer el lote de productos
            },
        });

        const idsProductosNoDisponibles = productosDisponibles.filter(
            (producto: Producto) => producto.stock < productos.find((producto: CompraProductos) => producto.id === producto.id).cantidad || producto.isActive == false
        );

        if (idsProductosNoDisponibles.length > 0) {
            return res.status(400).json({
                error: 'Productos no disponibles:' + idsProductosNoDisponibles.map((producto) => ' ' + producto.nombre),
            });
        }

        const ordenPedidos = productos.map((producto: CompraProductos) => ({
            productoId: producto.id,
            cantidad: producto.cantidad,
            precioUnd: producto.precio,
            precioProductos: producto.precio * producto.cantidad,
        }));

        const precioTotal = ordenPedidos.reduce((acc: number, ordenProductos: OrdenProductos) => {
            return acc + ordenProductos.precioProductos;
        }, 0);

        // Execute all operations within a Prisma transaction
        const nuevoPedido = await prisma.$transaction(async (prisma) => {
            const createdOrden = await prisma.orden.create({
                data: {
                    user: { connect: { id: idUsuario } },
                    tipoOrden,
                    estadoOrden: 'PENDIENTE',
                    precioTotal,
                    ordenProductos: { create: ordenPedidos },
                },
                include: { ordenProductos: true },
            });

            for (const producto of ordenPedidos) {
                await prisma.producto.update({
                    where: { id: producto.productoId },
                    data: {
                        stock: {
                            decrement: producto.cantidad,
                        },
                    },
                });
            }

            return createdOrden;
        });

        return res.status(201).json(nuevoPedido);
    } catch (error) {
        console.error(error);
        // Rollback the transaction if any error occurs
        return res.status(500).json({ error: 'Error al crear la orden' });
    }
}


// Función para obtener todos los pedidos
async function getAllOrdenes(req: ExtendedRequest, res: Response) {
    const query = req.query;
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.params.pageSize) || 10;

    /*Si la solicitud la realiza un usuario no administrador se agrega su id para 
    solo realizar consultas de ordenes propios, si intenta consultar un orden 
    ajeno no se encontrara en base de datos*/
    if (req.user?.rol != 2) {
        query.userId = req.user?.id;
    }

    try {
        const opcionesFiltros = Object.keys(prisma.orden.fields);
        const filtrosRequest = Object.fromEntries(
            Object.entries(query)
                .filter(([key]) => opcionesFiltros.includes(key)) // Filtro para las llaves compartidas
        );


        const pedidos = await prisma.orden.findMany({
            include: {
                ordenProductos: {
                    include: {
                        producto: true,
                    },
                },
            },
            where: {
                ...filtrosRequest
            },
            take: pageSize,
            skip: (page - 1) * pageSize,
        });
        res.status(200).json(pedidos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los pedidos' });
    }
}


// Función para obtener un pedido por ID
async function getOrdenById(req: ExtendedRequest, res: Response) {
    const { id } = req.params;
    const query = req.query;

    /*Si la solicitud la realiza un usuario no administrador se agrega su id para 
    solo realizar consultas de ordenes propios, si intenta consultar un orden 
    ajeno no se encontrara en base de datos*/
    if (req.user?.rol != 2) {
        query.userId = req.user?.id;
    }

    try {

        const pedido = await prisma.orden.findUnique({
            where: {
                id: parseInt(id),
                ...query
            },
            include: {
                ordenProductos: {
                    include: {
                        producto: true,
                    },
                },
            },
        });

        if (!pedido) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        return res.status(200).json(pedido);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener el pedido' });
    }
}


// Función para cancelar un pedido
async function cancelOrden(req: ExtendedRequest, res: Response) {
    const { id } = req.params;

    const usuarioActual = req.user?.id;

    try {
        /*solo se permite cancelar si el rol es administrador o el mismo usuario esta realizando la modificación */
        const idUsuario = req.user?.rol != 2 ? req.user?.id : req.body.idUsuario;

        const pedidoActual = await prisma.orden.update({
            where: {
                id: parseInt(id),
                userId: idUsuario,
                estadoOrden: {
                    notIn: ['CANCELADO', 'FINALIZADO']
                }
            },
            data: {
                estadoOrden: 'CANCELADO',
            },
            include: {
                ordenProductos: {
                    select: {
                        cantidad: true, // Only select needed field
                        producto: {
                            select: {
                                id: true, // Only select needed field
                            },
                        },
                    },
                },
            },
        }).catch((error) => {
            errorLogger.error(error);
        });

        if (!pedidoActual) {
            return res.status(404).json({ error: 'Pedido no encontrado o ya ha sido cerrado' });
        }

        // Update product availability using retrieved data
        for (const item of pedidoActual.ordenProductos) {
            await prisma.producto.update({
                where: { id: item.producto.id },
                data: {
                    stock: {
                        increment: item.cantidad,
                    },
                },
            });
        }

        return res.status(200).json({ message: 'Pedido cancelado' });
    } catch (error) {
        errorLogger.error(error);
        return res.status(500).json({ error: 'Error al cancelar el pedido' });
    }
}


// Función para actualizar un pedido (parcialmente)
async function updateOrden(req: Request, res: Response) {
    const { id } = req.params;
    const { tipoOrden, estadoOrden, direccion } = req.body; // Permitir actualizar solo tipoOrden y estadoOrden

    if (tipoOrden === 'delivery' && !direccion) {
        return res.status(400).json({ error: 'La dirección es obligatoria para pedidos a domicilio' });
    }

    try {
        const pedidoActualizado = await prisma.orden.update({
            where: { id: parseInt(id) },
            data: {
                tipoOrden,
                estadoOrden,
            },
        });

        if (!pedidoActualizado) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        return res.status(200).json(pedidoActualizado);
    } catch (error) {
        errorLogger.error(error);
        return res.status(500).json({ error: 'Error al actualizar el pedido' });
    }
}

export {
    createOrden,
    getAllOrdenes,
    getOrdenById,
    cancelOrden,
    updateOrden,
};
