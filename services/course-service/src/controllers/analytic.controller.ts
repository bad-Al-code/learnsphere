import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { NotAuthorizedError } from '../errors';
import { AnalyticsService } from '../services';

export class AnalyticsController {
  public static async getLearningAnalytics(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const instructorId = req.currentUser?.id;
      if (!instructorId) throw new NotAuthorizedError();

      const data = await AnalyticsService.getLearningAnalytics(instructorId);
      res.status(StatusCodes.OK).json(data);
    } catch (error) {
      next(error);
    }
  }
}
