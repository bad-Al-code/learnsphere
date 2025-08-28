import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { NotAuthorizedError } from '../errors';
import { AnalyticsService } from '../services/analytics.service';

/**
 * @class AnalyticsController
 * @description Handles incoming HTTP requests for the analytics routes.
 * It extracts necessary information from the request, calls the appropriate
 * service methods, and formats the response.
 */
export class AnalyticsController {
  public static async getInstructorStats(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const instructorId = req.currentUser?.id;
      if (!instructorId) {
        throw new NotAuthorizedError();
      }

      const stats = await AnalyticsService.getInstructorAnalytics(instructorId);

      res.status(StatusCodes.OK).json(stats);
    } catch (error) {
      next(error);
    }
  }

  public static async getInstructorTrends(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const instructorId = req.currentUser?.id;
      if (!instructorId) {
        throw new NotAuthorizedError();
      }
      const trends = await AnalyticsService.getInstructorTrends(instructorId);
      res.status(StatusCodes.OK).json(trends);
    } catch (error) {
      next(error);
    }
  }

  public static async getInstructorCoursePerformance(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const instructorId = req.currentUser?.id;
      if (!instructorId) {
        throw new NotAuthorizedError();
      }

      const performanceData =
        await AnalyticsService.getInstructorCoursePerformance(instructorId);

      res.status(StatusCodes.OK).json(performanceData);
    } catch (error) {
      next(error);
    }
  }

  public static async getDemographicAndDeviceStats(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const instructorId = req.currentUser?.id;
      if (!instructorId) throw new NotAuthorizedError();
      const stats =
        await AnalyticsService.getDemographicAndDeviceStats(instructorId);
      res.status(StatusCodes.OK).json(stats);
    } catch (error) {
      next(error);
    }
  }

  public static async getTopStudents(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const instructorId = req.currentUser?.id;
      if (!instructorId) throw new NotAuthorizedError();

      const topStudents = await AnalyticsService.getTopStudents(instructorId);

      res.status(StatusCodes.OK).json(topStudents);
    } catch (error) {
      next(error);
    }
  }

  public static async getModuleProgress(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const instructorId = req.currentUser?.id;
      if (!instructorId) throw new NotAuthorizedError();

      const progress = await AnalyticsService.getModuleProgress(instructorId);

      res.status(StatusCodes.OK).json(progress);
    } catch (error) {
      next(error);
    }
  }

  public static async getWeeklyEngagement(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const instructorId = req.currentUser?.id;
      if (!instructorId) throw new NotAuthorizedError();

      const engagement =
        await AnalyticsService.getWeeklyEngagement(instructorId);

      res.status(StatusCodes.OK).json(engagement);
    } catch (error) {
      next(error);
    }
  }

  public static async getLearningAnalytics(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const instructorId = req.currentUser?.id;
      if (!instructorId) throw new NotAuthorizedError();

      const analytics =
        await AnalyticsService.getLearningAnalytics(instructorId);

      res.status(StatusCodes.OK).json(analytics);
    } catch (error) {
      next(error);
    }
  }

  public static async getStudentGrade(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId, studentId } = req.params;
      const instructorId = req.currentUser?.id;
      if (!instructorId) throw new NotAuthorizedError();

      const gradeInfo = await AnalyticsService.getStudentAverageGrade(
        courseId,
        studentId
      );
      res.status(StatusCodes.OK).json(gradeInfo);
    } catch (error) {
      next(error);
    }
  }

  public static async getDiscussionEngagement(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();

      const engagement = await AnalyticsService.getDiscussionEngagement(
        req.currentUser.id
      );

      res.status(StatusCodes.OK).json(engagement);
    } catch (error) {
      next(error);
    }
  }

  public static async getCourseStats(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const instructorId = req.currentUser?.id;
      if (!instructorId) throw new NotAuthorizedError();

      const stats = await AnalyticsService.getCourseStats(courseId);

      res.status(StatusCodes.OK).json(stats);
    } catch (error) {
      next(error);
    }
  }

  public static async getStudentPerformance(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const instructorId = req.currentUser?.id;
      if (!instructorId) throw new NotAuthorizedError();

      const performanceData =
        await AnalyticsService.getStudentPerformance(courseId);
      res.status(StatusCodes.OK).json(performanceData);
    } catch (error) {
      next(error);
    }
  }

  public static async getCourseActivityStats(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const instructorId = req.currentUser?.id;
      if (!instructorId) throw new NotAuthorizedError();

      const stats = await AnalyticsService.getCourseActivityStats(courseId);

      res.status(StatusCodes.OK).json(stats);
    } catch (error) {
      next(error);
    }
  }

  public static async getModulePerformance(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const performance = await AnalyticsService.getModulePerformance(courseId);
      res.status(StatusCodes.OK).json(performance);
    } catch (error) {
      next(error);
    }
  }

  public static async getAverageSessionTime(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;

      const sessionTime =
        await AnalyticsService.getAverageSessionTime(courseId);

      res.status(StatusCodes.OK).json(sessionTime);
    } catch (error) {
      next(error);
    }
  }
}
