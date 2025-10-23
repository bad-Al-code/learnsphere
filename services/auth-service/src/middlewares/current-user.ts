import { eq } from 'drizzle-orm';
import { NextFunction, Request, Response } from 'express';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';

import { env } from '../config/env';
import logger from '../config/logger';
import { db } from '../db';
import { users } from '../db/schema';
import { BlacklistService } from '../services/blacklist-service';
import { CurrentUser, TokenPayload } from '../types/auth.types';

declare global {
  namespace Express {
    interface Request {
      currentUser?: CurrentUser;
    }
  }
}

export const currentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.signedCookies.token;

  if (!token) {
    return next();
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET!) as TokenPayload;

    const isRevoked = await BlacklistService.isBlacklisted(payload.jti);
    if (isRevoked) {
      logger.warn(
        `Attempt to use a blacklisted token was blocked. JTI: ${payload.jti}`
      );

      return next();
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, payload.id),
    });

    if (
      !user ||
      (user.passwordChangedAt &&
        user.passwordChangedAt.getTime() / 1000 > payload.iat)
    ) {
      if (user) {
        logger.warn(
          `Attempt to use an old token after password change for user ${user.id}`
        );
      }
      return next();
    }

    req.currentUser = { tokenPayload: payload, dbUser: user };
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      logger.warn(`Invalid JWT received: ${error.message}`);
    } else {
      logger.error('An unexpected error occurred in currentUser middleware', {
        error,
      });
    }
  }

  next();
};
