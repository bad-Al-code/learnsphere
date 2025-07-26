import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import logger from '../config/logger';
import { UserPayload } from '../types';
import { env } from '../config/env';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.signedCookies.token;

  if (!token) {
    return next();
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as UserPayload;
    req.currentUser = payload;
    logger.debug(`Current user identified via JWT: ${payload.id}`);
  } catch (_err) {
    logger.warn('Received an invalid or expired JWT.');
  }

  next();
};
