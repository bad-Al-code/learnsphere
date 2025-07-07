import { NextFunction, Request, Response } from 'express';
import { ForbiddenError } from '../errors';

type UserRole = 'student' | 'instructor' | 'admin';

export const requireRole = (allowRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.currentUser?.tokenPayload.role;

    if (!userRole || !allowRoles.includes(userRole)) {
      throw new ForbiddenError();
    }

    next();
  };
};
