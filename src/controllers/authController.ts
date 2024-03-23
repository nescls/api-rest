import { PrismaClient } from '@prisma/client'; 
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const dotenv = require('dotenv');
dotenv.config();
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'default';

// Controlador para login
    async function handleLogin(req: Request, res: Response) {
        const { username, password } = req.body;

        try {
            if (!username || !password) {
                return res.status(400).json({ message: 'Username y password son requeridos.' });
            }


            // Validacion del usuario
            const foundUser = await prisma.user.findUnique({
                where: { username: username },
            });

            if (!foundUser) {
                return res.sendStatus(401); // Unauthorized
            }

            const match = await bcrypt.compare(password, foundUser.password);
            if (match) {
                const role = foundUser.rol;
                console.log(refreshTokenSecret);
                // Crear token JWTs
                const accessToken = jwt.sign(
                    {
                        UserInfo: {
                            id: foundUser.id,
                            username: foundUser.username,
                            role: foundUser.rol,
                        },
                    },
                    refreshTokenSecret,
                    { expiresIn: '1d' }
                );
                console.log(accessToken);
                
                const refreshToken = jwt.sign(
                    { username: foundUser.username },
                    refreshTokenSecret,
                    { expiresIn: '1d' }
                );

                // Guardado del token
                await prisma.user.update({
                    where: { id: foundUser.id },
                    data: { refreshToken },
                });

                res.cookie('jwt', refreshToken, {
                    httpOnly: true,
                    sameSite: 'none',
                    secure: true,
                    maxAge: 24 * 60 * 60 * 1000,
                });

                res.json({ accessToken });
            } else {
                res.sendStatus(401).json({ message: "Credenciales inválidas"});
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }

export { handleLogin };