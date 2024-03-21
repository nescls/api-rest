import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function registro(req: Request, res: Response) {
  const { username, telefono, correo, password } = req.body;

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
    // Handle other errors (e.g., network issues)
    console.error(error);
    return res.status(500).json({ message: 'An error occurred during registration.' });
  }
}

export { registro };