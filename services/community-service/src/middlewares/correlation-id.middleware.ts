import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

declare global {
  namespace Express {
    interface Request {
      correlationId?: string;
    }
  }
}

export const correlationIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const id = uuidv4();

  req.correlationId = id;
  res.setHeader('X-Correlation-ID', id);

  next();
};
