import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function registro(req: Request, res: Response) {
  const { username, telefono, correo, password } = req.body;

  if (!username || !correo || !password) {
    return res.status(400).json({ message: 'Campo requerido faltante: username, correo y password son requerido.' });
  }

  const hashedPwd = await bcrypt.hash(password, 10);

  try {
    const usuarioExistente = await prisma.user.findFirst({
      where: {
        OR: [
          { username }, 
          { correo },   
        ],
      },
    });

    if (usuarioExistente) { 

      const campoRepetido = usuarioExistente.username === username ? 'username' : 'correo'; //Campo repetido
      const message = `${campoRepetido} Ya en uso. Ingrese un campo distinto.`;
      return res.status(400).json({ message });
    }

    const newUser = await prisma.user.create({
      data: {
        username,
        telefono,
        correo,
        password: hashedPwd,
      },
    });
    res.json(newUser);
  } catch (error) {
    // Manejar otros errores
    console.error(error);
    return res.status(500).json({ message: 'Ocurrio un error durante el registro, intente más tarde.' });
  }
}

async function editUser(req: Request, res: Response) {
  const { user } = req.body;
  const { id } = req.params;

  if (!user || !id) {
    return res.status(400).json({ message: '.' });
  }

  try {
    // Find and update the user in one step with 'update'
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) }, // Ensure id is a number
      data: user,
    });

    if (!updatedUser) { // Validacion de usuario existente
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Return updated user information
    return res.status(200).json({
      message: 'User updated successfully',
      updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
}

async function deleteUser(req: Request, res: Response) {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: 'Incomplete body.' });
  }

  try {
    // Deactivate the user and set deletedAt timestamp
    const now = new Date(); // Get current timestamp

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        isActive: false,
        deletedAt: now, // Set deletedAt to current timestamp
      },
    });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ message: 'User deactivated successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
}

export { registro, editUser };