import { NextFunction, Request, Response } from 'express';
import logger from '../config/logger';

export const httpLogger = (req: Request, res: Response, next: NextFunction) => {
  res.on('finish', () => {
    if (
      req.originalUrl.startsWith('/api/enrollments/health') &&
      res.statusCode === 200
    )
      return;

    logger.info(
      `HTTP Request: ${req.method} ${req.originalUrl} - Status ${res.statusCode}`
    );
  });

  next();
};
