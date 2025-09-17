import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '../config/logger';
import { CustomError } from '../errors';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof CustomError) {
    logger.warn('CustomError handled %o', {
      correlationId: req.correlationId,
      error: {
        name: err.name,
        message: err.message,
        statusCode: err.statusCode,
        fields: err.serializeErrors(),
      },
      request: {
        method: req.method,
        url: req.originalUrl,
      },
    });

    res.status(err.statusCode).json({ errors: err.serializeErrors() });
    return;
  }

  logger.warn('An unexpected error occured %o', {
    correlationId: req.correlationId,
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
