import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../errors';
import logger from '../config/logger';
import { StatusCodes } from 'http-status-codes';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ errors: err.serializeErrors() });
    return;
  }

  logger.warn('An unexpected error occured: %o', {
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
