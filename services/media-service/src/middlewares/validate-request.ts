import { AnyZodObject, ZodError } from "zod";
import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors";

export const validateRequest =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({ body: req.body, query: req.query, params: req.params });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map(
          (err: (typeof error.errors)[number]) => ({
            message: err.message,
            field: err.path.slice(1).join("."),
          })
        );

        throw new BadRequestError(errors);
      }

      next(error);
    }
  };
