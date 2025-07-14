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

  public static async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { courseId } = req.params;

      const course = await CourseService.getCourseDetails(courseId);

      res.status(StatusCodes.OK).json(course);
    } catch (error) {
      next(error);
    }
  }

  public static async list(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 12;

      const result = await CourseService.listCourses(page, limit);

      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
}
