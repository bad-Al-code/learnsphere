import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { CustomError } from '../errors';
import logger from '../config/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ errors: err.serializeErrors() });
    return;
  }

  logger.warn('An unexpected error occured', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    errors: [{ message: 'Something went wrong, please try again later' }],
  });
  return;
};
