import {Request} from 'express';

export interface ExtendedRequest extends Request {
    user?: {
      id: string;
      rol: number;
    };
  }