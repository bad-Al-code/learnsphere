import { NextFunction, Request, Response } from 'express';

import { NotAuthorizedError } from '../errors/not-authorized-error';

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (!req.currentUser) {
    throw new NotAuthorizedError(
      'Authentication is required to access this route.'
    );
  }
  next();
};
