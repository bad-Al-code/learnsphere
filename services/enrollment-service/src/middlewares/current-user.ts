import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';

import logger from '../config/logger';

interface UserPayload {
  id: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

const ignorePaths = ['/api/enrollments/health'];

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.signedCookies.token;

  if (!token) {
    if (!ignorePaths.includes(req.path)) {
      logger.debug(`No token found in signed cookies`);
    }

    return next();
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;

    req.currentUser = payload;

    logger.debug(
      `Current user identified: ${payload.email} (ID: ${payload.id})`
    );
  } catch (err) {
    logger.warn('Invalid JWT received', { error: (err as Error).message });
  }

  next();
};
