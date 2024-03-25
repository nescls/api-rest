import {PrismaClient, Producto } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();
// Crear un nuevo producto
async function createProducto(req: Request, res: Response) {
    const { nombre, descripcion, precio, stock, isActive } = req.body;
    try {
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
        console.error(error);
        return res.status(500).json({ error: 'Error al crear el producto' });
    }
}


// Obtener todos los productos
async function getAllProductos(req: Request, res: Response) {
    const query = req.query;
    try {
        const productos = await prisma.producto.findMany({
            where: {
                ...query,
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

        });
        return res.status(200).json(productos);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Error al obtener los productos' });
    }
}


// Obtener un producto específico por ID
async function getProductoById(req: Request, res: Response) {
    const { id } = req.params;

    try {
        const producto = await prisma.producto.findUnique({
            where: { id: parseInt(id) },
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
        console.error(error);
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

        return res.status(200).json(productoActualizado);
    } catch (error) {
        console.error(error);
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
        console.error(error);
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
