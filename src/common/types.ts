import { Producto } from '@prisma/client';
import {Request} from 'express';

export interface ExtendedRequest extends Request { //Agregado de los datos del usuario al request
    user?: {
      id: string;
      rol: number;
    };
  }

  export interface CompraProductos extends Producto { //Agregado de cantidad de un producto para las ordenes
    cantidad: number;
  }