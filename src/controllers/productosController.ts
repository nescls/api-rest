import {PrismaClient, Producto } from '@prisma/client';
import { Request, Response } from 'express';
import { errorLogger } from '../config/loggerConfig';
import { ExtendedRequest } from '../common/types';

const prisma = new PrismaClient();
// Crear un nuevo producto
async function createProducto(req: Request, res: Response) {
    const { nombre, descripcion, precio, stock, isActive } = req.body;

    if (!nombre || !descripcion || !precio || !stock || !isActive) {
        return res.status(400).json({ message: 'Campos requeridos:  nombre, descripcion, precio, stock.' });
      }
    try {
        const productoExistente = await prisma.producto.findFirst({
            where: {
              OR: [
                { nombre },
              ],
            },
          });
      
          if (productoExistente) {
            const message = `Nombre ya en uso. Ingrese un valor distinto.`;
            return res.status(400).json({ message });
          }

        const nuevoProducto = await prisma.producto.create({
            data: {
                nombre,
                descripcion,
                precio,
                stock,
                isActive
            }, 
        });
        return res.status(201).json(nuevoProducto);
    } catch (error) {
            errorLogger.error(error);
        return res.status(500).json({ error: 'Error al crear el producto' });
    }
}


// Obtener todos los productos
async function getAllProductos(req: ExtendedRequest, res: Response) {
    const query = req.query as any;
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    
     if (req.user?.rol != 2) { //los usuarios clientes solo podran ver los productos activos
        query.isActive = true;
    }
    
    try {
        const opcionesFiltros = Object.keys(prisma.producto.fields);//Se extraen los parametros permitidos para el filtrado del modelo
        const filtrosRequest = Object.fromEntries(
            Object.entries(query)
              .filter(([key]) => opcionesFiltros.includes(key))
          );
        
        const productos = await prisma.producto.findMany({
            where: {
                ...filtrosRequest,
            },
            select: {
                id:true,
                nombre: true,
                descripcion: true,
                precio: true,
                stock: true,
                isActive: true,
                createdAt: true,
            },
            take: pageSize,
            skip: (page - 1) * pageSize,
        });
        return res.status(200).json(productos);
    } catch (error) {
            errorLogger.error(error);
        return res.status(500).json({ error: 'Error al obtener los productos' });
    }
}


// Obtener un producto específico por ID
async function getProductoById(req: ExtendedRequest, res: Response) {
    const { id } = req.params;

    try {
        const query = req.user?.rol != 2 ?  {isActive : true} : {};//los usuarios clientes solo podran ver los productos activos

        const producto = await prisma.producto.findUnique({
            where: { id: parseInt(id), ...query },
            select: {
                id: true,
                nombre: true,
                descripcion: true,
                precio: true,
                stock: true,
                isActive: true,
                createdAt: true,
            },
        });

        if (!producto) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        return res.status(200).json(producto);
    } catch (error) {
            errorLogger.error(error);
        return res.status(500).json({ error: 'Error al obtener el producto' });
    }
}


// Actualizar un producto
async function updateProducto(req: Request, res: Response) {
    const producto = req.body as Producto;
    const { id } = req.params;

    try {
        const productoActualizado = await prisma.producto.update({
            where: { id: parseInt(id) },
            data: {
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                precio: producto.precio,
                stock: producto.stock,
                isActive: producto.isActive
            },
        });

        if (!productoActualizado) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        return res.status(200).json({
            message: 'Producto actualizado con éxito',
            productoActualizado});
    } catch (error) {
            errorLogger.error(error);
        return res.status(500).json({ error: 'Error al actualizar el producto' });
    }
}


// Eliminar un producto
async function deleteProducto(req: Request, res: Response) {
    const { id } = req.params;

    try {
        // Desactivar el prodcuto y establecer marca de tiempo 'deletedAt'
        const now = new Date(); // Obtener marca de tiempo actual

        const productoEliminado = await prisma.producto.update({
            where: { id: parseInt(id) },
            data: {
                isActive: false,
                deletedAt: now,
            },
            select: {
                id: true,
                nombre: true,
                isActive: true,
            },
        });

        if (!productoEliminado) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        return res.status(200).json({ message: 'Producto eliminado' });
    } catch (error) {
            errorLogger.error(error);
        return res.status(500).json({ error: 'Error al eliminar el producto' });
    }
}

export {
    createProducto,
    getAllProductos,
    getProductoById,
    updateProducto,
    deleteProducto,
};
