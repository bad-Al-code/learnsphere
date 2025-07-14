import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

import logger from '../config/logger';
import { env } from '../config/env';

interface UserPayload {
  id: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

const ignorePath = ['/api/courses/health'];

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.signedCookies.token;

  if (!token) {
    if (!ignorePath.includes(req.path)) {
      logger.debug(`No token found in signed cookies`);
    }

    return next();
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as UserPayload;

    req.currentUser = payload;

    logger.debug(
      `Current user identified: ${payload.email} (ID: ${payload.id})`
    );
  } catch (err) {
    logger.warn('Invalid JWT received', { error: (err as Error).message });
  }

  next();
};
