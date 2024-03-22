import { NextFunction, Request, Response } from 'express';
import { errorLogger } from '../../config/loggerConfig';

const errorHandlerMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  errorLogger.error(err.stack); // Log the error stack trace
  next(err); // Pass the error to the next middleware or error handler
};

export default errorHandlerMiddleware;