import { NextFunction, Request, Response } from "express";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { BlacklistService } from "../services/blacklist-service";
import logger from "../config/logger";

interface UserPayload {
  id: string;
  email: string;
  jti: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
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
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;

    const isRevoked = await BlacklistService.isBlacklisted(payload.jti);
    if (isRevoked) {
      logger.warn(
        `Attempt to use a blacklisted token was blocked. JTI: ${payload.jti}`
      );

      return next();
    }

    req.currentUser = payload;
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
