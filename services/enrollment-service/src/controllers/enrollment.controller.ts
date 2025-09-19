import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { EnrollRepository } from '../db/repositories';
import { getEnrollmentsSchema } from '../schema/enrollment.schema';
import { AnalyticsService } from '../services/analytics.service';
import { EnrollmentService } from '../services/enrollment.service';

export class EnrollmentController {
  public static async enrollUserInCourse(req: Request, res: Response) {
    const { courseId } = req.body;
    const userId = req.currentUser!.id;

    const enrollment = await EnrollmentService.enrollUserInCourse({
      userId,
      courseId,
    });

    res.status(StatusCodes.CREATED).json(enrollment);
  }

  public static async getMyCourses(req: Request, res: Response) {
    const userId = req.currentUser!.id;
    const enrollments = await EnrollmentService.getEnrollmentsByUserId(userId);

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

  public static async markProgress(req: Request, res: Response) {
    const { courseId, lessonId } = req.body;
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
    await EnrollmentService.checkEnrollment(req, res, next);
  }

  public static async resetProgress(req: Request, res: Response) {
    const { enrollmentId } = req.params;
    const requesterId = req.currentUser!.id;

    await EnrollmentService.resetEnrollmentProgress({
      enrollmentId,
      requesterId,
    });

    res
      .status(StatusCodes.OK)
      .json({ message: 'Course progress has been successfully reset' });
  }

  public static async manualEnrollment(req: Request, res: Response) {
    const { userId, courseId } = req.body;
    const requester = req.currentUser!;

    const enrollment = await EnrollmentService.enrollUserManually({
      userId,
      courseId,
      requester,
    });

    res.status(StatusCodes.CREATED).json(enrollment);
  }

  public static async suspendEnrollment(req: Request, res: Response) {
    const { enrollmentId } = req.params;
    const requester = req.currentUser!;

    await EnrollmentService.suspendEnrollment({ enrollmentId, requester });

    res
      .status(StatusCodes.OK)
      .json({ message: 'Enrollment suspended succesfully' });
  }

  public static async reinstateEnrollment(req: Request, res: Response) {
    const { enrollmentId } = req.params;
    const requester = req.currentUser!;

    await EnrollmentService.reinstateEnrollment({ enrollmentId, requester });

    res
      .status(StatusCodes.OK)
      .json({ message: 'Enrollment reinstated succesfully' });
  }

  public static async getEnrollmentsForCourse(req: Request, res: Response) {
    const { courseId } = req.params;
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
      const { courseId, moduleId, lessonId } = req.body;
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
      const { sessionId } = req.body;

      await AnalyticsService.logSessionEnd(sessionId);

      res.status(StatusCodes.OK).send();
    } catch (error) {
      next(error);
    }
  }
}
