import { NextFunction, Request, Response } from "express";
import logger from "../config/logger";

export const httpLogger = (req: Request, res: Response, next: NextFunction) => {
  res.on("finish", () => {
    logger.info(
      `HTTP Request: ${req.method} ${req.originalUrl} - Status ${res.statusCode}`
    );
  });

  next();
};
