import { NextFunction, Request, Response } from 'express';
import { errorLogger } from '../../config/loggerConfig';

const errorHandlerMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  errorLogger.error(err.stack);
  next(err);
};

export default errorHandlerMiddleware;