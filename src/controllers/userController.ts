import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';
import { ExtendedRequest } from '../common/types';

const prisma = new PrismaClient();

// Función para registrar un nuevo usuario
async function registro(req: Request, res: Response) {
  const { username, telefono, correo, password } = req.body;

  // Validación de campos obligatorios
  if (!username || !correo || !password) {
    return res.status(400).json({ message: 'Campos requeridos faltantes: nombre de usuario, correo electrónico y contraseña son obligatorios.' });
  }

  const hashedPwd = await bcrypt.hash(password, 10); // Contraseña encriptada

  try {
    // Buscar usuario existente por nombre de usuario o correo electrónico
    const usuarioExistente = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { correo },
        ],
      },
    });

    if (usuarioExistente) {
      const campoRepetido = usuarioExistente.username === username ? 'nombre de usuario' : 'correo electrónico'; // Campo duplicado
      const message = `${campoRepetido} ya en uso. Ingrese un valor distinto.`;
      return res.status(400).json({ message });
    }

    // Crear nuevo usuario
    const newUser = await prisma.user.create({
      data: {
        username,
        telefono,
        correo,
        password: hashedPwd,
      },
    });

    res.json(newUser); // Regresar información del usuario creado
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Ocurrió un error durante el registro. Intente más tarde.' });
  }
}

// Función para editar la información de un usuario
async function editUser(req: ExtendedRequest, res: Response) {
  const { username, telefono, correo } = req.body; // Datos del usuario a actualizar
  const { id } = req.params; // ID del usuario

  // Validación de campos obligatorios
  if (!username || !telefono || !correo) {
    return res.status(400).json({ message: 'Campos requeridos faltantes.' });
  }

  try {
    // Buscar y actualizar el usuario en un solo paso con 'update'
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) }, // Asegurarse de que 'id' sea un número
      data: {
        username,
        telefono,
        correo,
      },
    });

    if (!updatedUser) { // Validación de usuario existente
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Regresar la información del usuario actualizado
    return res.status(200).json({
      message: 'Usuario actualizado con éxito',
      updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}

// Función para desactivar (borrar) un usuario
async function deleteUser(req: ExtendedRequest, res: Response) {
  const { id } = req.params;

  // Validación de campo obligatorio
  if (!id) {
    return res.status(400).json({ message: 'Cuerpo incompleto.' });
  }

  try {
    // Desactivar el usuario y establecer marca de tiempo 'deletedAt'
    const now = new Date(); // Obtener marca de tiempo actual

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        isActive: false,
        deletedAt: now, // Establecer 'deletedAt' a la marca de tiempo actual
      },
    });

    if (!updatedUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    return res.status(200).json({ message: 'Usuario desactivado con éxito' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error del servidor' });
  }
}

export { registro, editUser, deleteUser };
