import { NextFunction, Request, Response } from 'express';
import { ExtendedRequest } from '../../common/types';

const verifyRoles = (...allowedRoles: number[]) => {
  return (req: ExtendedRequest, res: Response, next: NextFunction) => {
    // Verificar si faltan roles en la solicitud
    if (!req?.user?.rol) {
      return res.status(401).json({ message: 'No autorizado: Roles faltantes' });
    }

    // Compara el rol de usuario con el arreglo de roles permitidos
    const hasAllowedRole = allowedRoles.includes(req.user.rol);

    if (!hasAllowedRole) {
      return res.status(403).json({ message: 'Prohibido: Permisos insuficientes' });
    }

    next();
  };
};

export default verifyRoles;
