import { NextFunction, Request, Response } from "express";
import { UnauthenticatedError } from "../errors";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    throw new UnauthenticatedError("Unauthorized User");
  }

  next();
};
