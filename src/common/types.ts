import { Producto } from '@prisma/client';
import {Request} from 'express';

export interface ExtendedRequest extends Request {
    user?: {
      id: string;
      rol: number;
    };
  }

  export interface CompraProductos extends Producto {
    cantidad: number;
  }