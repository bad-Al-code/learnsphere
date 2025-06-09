import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AnyZodObject, ZodError } from "zod";

export const validateRequest =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({ body: req.body, query: req.query, params: req.params });

      next();
    } catch (e) {
      if (e instanceof ZodError) {
        const errors = e.errors.map((err) => ({
          message: err.message,
          field: err.path.slice(1).join("."),
        }));

        res.status(StatusCodes.BAD_REQUEST).json({ errors });
        return;
      }

      next(e);
    }
  };
