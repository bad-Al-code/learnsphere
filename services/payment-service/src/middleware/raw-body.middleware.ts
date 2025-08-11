import bodyParser from 'body-parser';
import { NextFunction, Request, Response } from 'express';
import { BadRequestError } from '../errors';

export const rawBodyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  bodyParser.raw({ type: 'application/json' })(req, res, (err) => {
    if (err) {
      return next(err);
    }

    if (req.body && Buffer.isBuffer(req.body)) {
      const rawBodyString = req.body.toString();
      req.rawBody = rawBodyString;

      try {
        req.body = JSON.parse(rawBodyString);
      } catch (_e) {
        return next(new BadRequestError('Invalid JSON payload.'));
      }
    } else {
      req.rawBody = '';
      req.body = {};
    }

    next();
  });
};
