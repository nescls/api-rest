import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { errorLogger } from '../config/loggerConfig';

const prisma = new PrismaClient();

const dotenv = require('dotenv');
dotenv.config();
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'default';

// Controlador para login
async function handleLogin(req: Request, res: Response) {
    const { username, correo, password } = req.body;

    try {
        if ((!username && !correo) || !password) {
            return res.status(400).json({ message: 'Username/Correo y password son requeridos.' });
        }

        // Validación del usuario
        const usuario = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { correo },
                ],
            },
        });

        if (!usuario) {
            return res.status(401).json({ message: "Credenciales inválidas" });; // Unauthorized
        }

        const match = await bcrypt.compare(password, usuario.password);
        if (match) {
            // Crear token JWTs
            const accessToken = jwt.sign(
                {
                    UserInfo: {
                        id: usuario.id,
                        username: usuario.username,
                        role: usuario.rol,
                    },
                },
                refreshTokenSecret,
                { expiresIn: '1d' }
            );

            const refreshToken = jwt.sign(
                { username: usuario.username },
                refreshTokenSecret,
                { expiresIn: '1d' }
            );

            // Guardado del token
            await prisma.user.update({
                where: { id: usuario.id },
                data: { refreshToken },
            });

            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
                maxAge: 24 * 60 * 60 * 1000,
            });

            return res.json({ accessToken });
        } else {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }
    } catch (error) {
        errorLogger.error(error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export { handleLogin };