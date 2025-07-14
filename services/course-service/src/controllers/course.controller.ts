import { NextFunction, Request, Response } from "express";

import { NotAuthorizedError } from "../errors";
import { CourseService } from "../services/course.service";
import { StatusCodes } from "http-status-codes";

export class CourseController {
  public static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const instructorId = req.currentUser?.id;
      if (!instructorId) {
        throw new NotAuthorizedError();
      }

      const course = await CourseService.createCourse({
        ...req.body,
        instructorId,
      });

      res.status(StatusCodes.CREATED).json(course);
    } catch (error) {
      next(error);
    }
  }
}
