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
}
