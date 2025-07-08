import { RedisStore } from 'rate-limit-redis';
import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

import { redisConnection } from '../config/redis';
import { rateLimit, RateLimitRequestHandler } from 'express-rate-limit';

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
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    store: store,
    handler: (req, res, next, options) => {
      const retryAfterSeconds = Math.ceil(options.windowMs / 1000);

      res.setHeader('Retry-After', retryAfterSeconds);

      res.status(StatusCodes.TOO_MANY_REQUESTS).json({
        message: `Too many requests. You may try again after ${retryAfterSeconds} seconds.`,
      });
    },
  });

  return limiterInstance;
}

export const apiLimiter = (req: Request, res: Response, next: NextFunction) => {
  const limiter = createLimiter();

  limiter(req, res, next);
};
