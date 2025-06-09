import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ errors: [{ message: "Not Authorized" }] });

    return;
  }

  next();
};
