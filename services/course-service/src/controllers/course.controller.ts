import { NextFunction, Request, Response } from 'express';

import { StatusCodes } from 'http-status-codes';
import { MediaClient } from '../clients/media.client';
import { CourseRepository } from '../db/repostiories';
import { NotAuthorizedError } from '../errors';
import { CreateFullCourseDto, getCoursesQuerySchema } from '../schemas';
import {
  AuthorizationService,
  CourseCacheService,
  CourseService,
  ModuleService,
} from '../services';
import { CourseLevel } from '../types';

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

  public static async createFull(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const instructorId = req.currentUser!.id;
      const courseData: CreateFullCourseDto = req.body;

      const newCourse = await CourseService.createFullCourse(
        instructorId,
        courseData
      );
      res.status(StatusCodes.CREATED).json(newCourse);
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

  public static async getBulk(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { courseIds } = req.body;
      const courses = await CourseService.getCoursesByIds(courseIds);
      res.status(StatusCodes.OK).json(courses);
    } catch (error) {
      next(error);
    }
  }

  public static async getCourseModules(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { courseId } = req.params;
      const courseModules = await ModuleService.getModulesForCourses(courseId);
      res.status(StatusCodes.OK).json(courseModules);
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
      const categoryId = req.query.categoryId as string | undefined;
      const level = req.query.level as CourseLevel | undefined;

      const result = await CourseService.listCourses(
        page,
        limit,
        categoryId,
        level
      );

      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  public static async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { courseId } = req.params;
      const requester = req.currentUser;
      if (!requester) {
        throw new NotAuthorizedError();
      }

      const course = await CourseService.updateCourse(
        courseId,
        req.body,
        requester
      );

      res.status(StatusCodes.OK).json(course);
    } catch (error) {
      next(error);
    }
  }

  public static async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { courseId } = req.params;
      const requester = req.currentUser;
      if (!requester) {
        throw new NotAuthorizedError();
      }

      await CourseService.deleteCourse(courseId, requester);

      res
        .status(StatusCodes.OK)
        .json({ message: 'Course deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  public static async publish(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { courseId } = req.params;
      const requester = req.currentUser;
      if (!requester) {
        throw new NotAuthorizedError();
      }

      const course = await CourseService.publishCourse(courseId, requester);

      res.status(StatusCodes.OK).json(course);
    } catch (error) {
      next(error);
    }
  }

  public static async unpublish(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { courseId } = req.params;
      const requester = req.currentUser;
      if (!requester) {
        throw new NotAuthorizedError();
      }

      const course = await CourseService.unPublishCourse(courseId, requester);

      res.status(StatusCodes.OK).json(course);
    } catch (error) {
      next(error);
    }
  }

  public static async getStats(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const stats = await CourseService.getCourseStats();
      res.status(StatusCodes.OK).json(stats);
    } catch (error) {
      next(error);
    }
  }

  public static async searchForAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const query = req.query.q ? String(req.query.q) : '';
      const page = req.query.page ? parseInt(String(req.query.page), 10) : 1;
      const limit = req.query.limit
        ? parseInt(String(req.query.limit), 10)
        : 10;

      const result = await CourseService.listAllCoursesForAdmin(
        query,
        page,
        limit
      );
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  public static async getThumbnailUploadUrl(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const { filename } = req.body;
      const requester = req.currentUser!;

      await AuthorizationService.verifyCourseOwnership(courseId, requester);

      const uploadData = await MediaClient.requestCourseThumbnailUploadUrl(
        courseId,
        filename
      );

      res.status(StatusCodes.OK).json(uploadData);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route PATCH /api/courses/:courseId/price
   * @summary Update the price of a course
   * @param req.params.courseId - The ID of the course
   * @param req.body.price - The new price of the course
   * @returns 200 - Price updated successfully
   * @returns 401 - Unauthorized
   * @returns 403 - Forbidden
   * @returns 404 - Course not found
   * @returns 500 - Server error
   */
  public static async updatePrice(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const requester = req.currentUser!;
      const price = req.body.price;

      await AuthorizationService.verifyCourseOwnership(courseId, requester);

      await CourseRepository.update(courseId, { price });

      await CourseCacheService.invalidateCacheDetails(courseId);

      res.status(StatusCodes.OK).json({ message: 'Price updated.' });
    } catch (error) {
      next(error);
    }
  }

  public static async publicSearch(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const query = req.query.q ? String(req.query.q) : '';

      const courses = await CourseService.searchPublicCourses(query);

      res.status(StatusCodes.OK).json(courses);
    } catch (error) {
      next(error);
    }
  }

  public static async getForInstructor(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const instructorId = req.currentUser!.id;
      const queryParams = getCoursesQuerySchema.parse(req.query);

      const options = {
        instructorId,
        ...queryParams,
        query: queryParams.q,
      };

      const result = await CourseService.getCoursesForInstructor(options);

      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
}
