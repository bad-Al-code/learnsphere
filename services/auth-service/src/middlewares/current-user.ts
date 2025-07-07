import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { BlacklistService } from "../controllers/blacklist-service";
import logger from "../config/logger";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { userRoleEnum, users } from "../db/schema";

type UserRecord = typeof users.$inferSelect;

interface TokenPayload {
  id: string;
  email: string;
  role: (typeof userRoleEnum.enumValues)[number];
  jti: string;
  iat: number;
  exp: number;
}

interface CurrentUser {
  tokenPayload: TokenPayload;
  dbUser: UserRecord;
}

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
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;

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
      logger.error("An unexpected error occurred in currentUser middleware", {
        error,
      });
    }
  }

  next();
};
