import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { EnrollRepository } from '../db/repositories';
import { NotAuthorizedError } from '../errors';
import { courseIdParamsSchema } from '../schema';
import {
  createEnrollmentSchema,
  endSessionSchema,
  enrollmentIdParamSchema,
  getEnrollmentsSchema,
  getMyCoursesQuerySchema,
  manualEnrollmentSchema,
  markProgressSchema,
  startSessionSchema,
} from '../schema/enrollment.schema';
import { AnalyticsService } from '../services/analytics.service';
import { EnrollmentService } from '../services/enrollment.service';

export class EnrollmentController {
  public static async enrollUserInCourse(req: Request, res: Response) {
    const { courseId } = createEnrollmentSchema.parse({ body: req.body })[
      'body'
    ];
    const userId = req.currentUser!.id;

    const enrollment = await EnrollmentService.enrollUserInCourse({
      userId,
      courseId,
    });

    res.status(StatusCodes.CREATED).json(enrollment);
  }

  public static async manualEnrollment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const requester = req.currentUser;
      if (!requester) throw new NotAuthorizedError();

      const { userId, courseId } = manualEnrollmentSchema.parse({
        body: req.body,
      })['body'];

      const enrollment = await EnrollmentService.enrollUserManually({
        userId,
        courseId,
        requester,
      });

      res.status(StatusCodes.CREATED).json({
        message: 'User manually enrolled successfully',
        enrollment,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getMyCourses(req: Request, res: Response) {
    if (!req.currentUser) {
      throw new NotAuthorizedError();
    }
    const query = getMyCoursesQuerySchema.parse({ query: req.query }).query;

    const enrollments = await EnrollmentService.getMyCourses(
      req.currentUser.id,
      query
    );

    res.status(StatusCodes.OK).json(enrollments);
  }

  public static async getMyCourseIds(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.currentUser!.id;

      const enrollments =
        await EnrollRepository.findActiveAndCompletedByUserId(userId);
      const courseIds = enrollments.map((e) => e.courseId);

      res.status(StatusCodes.OK).json(courseIds);
    } catch (error) {
      next(error);
    }
  }

  public static async resetProgress(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const requester = req.currentUser;
      if (!requester) throw new NotAuthorizedError();

      const { enrollmentId } = enrollmentIdParamSchema.parse({
        params: req.params,
      }).params;

      const updatedEnrollment = await EnrollmentService.resetEnrollmentProgress(
        {
          enrollmentId,
          requesterId: requester.id,
        }
      );

      res.status(StatusCodes.OK).json({
        message: 'Enrollment progress reset successfully',
        enrollment: updatedEnrollment,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async markProgress(req: Request, res: Response) {
    const { courseId, lessonId } = markProgressSchema.parse({
      body: req.body,
    }).body;
    const userId = req.currentUser!.id;

    const updatedEnrollment = await EnrollmentService.markLessonAsComplete({
      userId,
      courseId,
      lessonId,
    });

    res.status(StatusCodes.OK).json({
      message: 'Progress updated successfully',
      progress: updatedEnrollment.progress,
      progressPercentage: updatedEnrollment.progressPercentage,
    });
  }

  public static async checkEnrollment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId, userId: userIdFromParams } = req.params;
      const userId = req.currentUser?.id || userIdFromParams;

      if (!userId) {
        throw new NotAuthorizedError();
      }

      const enrollment = await EnrollmentService.checkEnrollment(
        userId,
        courseId
      );

      res.status(StatusCodes.OK).json(enrollment);
    } catch (error) {
      next(error);
    }
  }

  public static async suspendEnrollment(req: Request, res: Response) {
    const { enrollmentId } = enrollmentIdParamSchema.parse({
      params: req.params,
    }).params;
    const requester = req.currentUser!;

    await EnrollmentService.suspendEnrollment({ enrollmentId, requester });

    res
      .status(StatusCodes.OK)
      .json({ message: 'Enrollment suspended succesfully' });
  }

  public static async reinstateEnrollment(req: Request, res: Response) {
    const { enrollmentId } = enrollmentIdParamSchema.parse({
      params: req.params,
    }).params;
    const requester = req.currentUser!;

    await EnrollmentService.reinstateEnrollment({ enrollmentId, requester });

    res
      .status(StatusCodes.OK)
      .json({ message: 'Enrollment reinstated succesfully' });
  }

  public static async getEnrollmentsForCourse(req: Request, res: Response) {
    const { courseId } = courseIdParamsSchema.parse({
      params: req.params,
    }).params;
    const { page, limit } = getEnrollmentsSchema.shape.query.parse(req.query);
    const requester = req.currentUser!;

    const result = await EnrollmentService.getEnrollmentsByCourseId({
      courseId,
      requester,
      page,
      limit,
    });

    res.status(StatusCodes.OK).json(result);
  }

  public static async startSession(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId, moduleId, lessonId } = startSessionSchema.parse({
        body: req.body,
      }).body;
      const userId = req.currentUser!.id;

      const result = await AnalyticsService.logSessionStart(
        userId,
        courseId,
        moduleId,
        lessonId
      );

      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  public static async endSession(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { sessionId } = endSessionSchema.parse({ body: req.body }).body;

      await AnalyticsService.logSessionEnd(sessionId);

      res.status(StatusCodes.OK).send();
    } catch (error) {
      next(error);
    }
  }
}
