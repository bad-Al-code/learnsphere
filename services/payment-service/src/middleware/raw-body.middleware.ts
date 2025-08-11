import bodyParser from 'body-parser';
import { NextFunction, Request, Response } from 'express';
import logger from '../config/logger';

export const rawBodyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  bodyParser.raw({ type: 'application/json' })(req, res, (err) => {
    if (err) {
      return next(err);
    }

    if (!req.body) {
      return next(new Error('Empty body'));
    }

    req.rawBody = (req.body as Buffer).toString();

    try {
      req.body = JSON.parse(req.rawBody);
    } catch (e) {
      logger.error(`Raw Body Middleware Error: ${e}`);
      return next(new Error('Invalid JSON payload'));
    }
    next();
  });
};
