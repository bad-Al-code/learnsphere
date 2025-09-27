import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { AnalyticsService } from '../services';

export class AnalyticsController {
  public static async getCommunityInsights(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const insights = await AnalyticsService.getCommunityInsights();

      res.status(StatusCodes.OK).json(insights);
    } catch (error) {
      next(error);
    }
  }
}
