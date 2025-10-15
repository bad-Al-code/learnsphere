import { NextFunction, Request, Response } from 'express';
import { env } from '../config';
import { NotAuthorizedError } from '../errors';

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }

  next();
};

export function requireAuthOrInternal(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const internalKey = req.headers['x-internal-api-key'];

  if (internalKey && internalKey === env.INTERNAL_API_KEY) {
    return next();
  }

  return requireAuth(req, res, next);
}
