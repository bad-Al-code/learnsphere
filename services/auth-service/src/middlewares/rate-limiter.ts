import { RedisStore } from "rate-limit-redis";
import { redisConnection } from "../config/redis";
import { rateLimit, RateLimitRequestHandler } from "express-rate-limit";
import { BadRequestError } from "../errors";
import { Request, Response, NextFunction } from "express";

let limiterInstance: RateLimitRequestHandler | null = null;

function createLimiter(): RateLimitRequestHandler {
  if (limiterInstance) {
    return limiterInstance;
  }

  const redisClient = redisConnection.getClient();

  const store = new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  });

  limiterInstance = rateLimit({
    windowMs: 15 * 60 * 1000, // 15min
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    store: store,
    handler: (req, res, next, options) => {
      throw new BadRequestError(
        `Too many requests, please try again after ${
          options.windowMs / 60000
        } minutes`
      );
    },
  });

  return limiterInstance;
}

export const apiLimiter = (req: Request, res: Response, next: NextFunction) => {
  const limiter = createLimiter();

  limiter(req, res, next);
};
