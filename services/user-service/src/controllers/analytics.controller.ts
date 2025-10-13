import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { NotAuthorizedError } from '../errors';
import { AnalyticsService } from '../services';

export class AnalyticsController {
  /**
   * Handles the HTTP request to get waitlist analytics.
   * @param req The Express request object.
   * @param res The Express response object.
   * @param next The Express next middleware function.
   */
  public static async getWaitlistAnalytics(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const analyticsData = await AnalyticsService.getWaitlistAnalytics(
        req.currentUser
      );

      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader(
        'Cache-Control',
        'private, no-cache, no-store, must-revalidate'
      );

      res.status(StatusCodes.OK).json({ success: true, data: analyticsData });
    } catch (error) {
      next(error);
    }
  }
}
