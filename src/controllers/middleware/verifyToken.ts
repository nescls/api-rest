import * as jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import { ExtendedRequest } from '../../common/types';

dotenv.config();

const verifyJWT = (req: ExtendedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.sendStatus(401);
  }

  // Extraer el token del encabezado
  const token = authHeader.split(' ')[1];

  try {
    // Verificar el token usando el secreto del token de actualización
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'default';

    const decoded = jwt.verify(token, refreshTokenSecret) as { UserInfo: { id: string, username: string, role: number } };
    console.log('Carga útil JWT decodificada:', decoded); // Registrar carga útil decodificada para depuración

    // Extraer la información del usuario de la carga útil decodificada
    const userId = decoded.UserInfo.id;
    const rol = decoded.UserInfo.role; 

    // Se agrega la información del usuario del token para el manejo de validaciones
    req.user = { id: userId, rol };


    next();
  } catch (error) {
    console.error('Error de verificación JWT:', error);

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expirado' });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ message: 'Token inválido' });
    } else {
      // Manejo de errores posible (por ejemplo, verificación secreta fallida, puede ocurrir cuando la verificación no comparte la llave con el login)
      console.error(error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  }
};

export default verifyJWT;