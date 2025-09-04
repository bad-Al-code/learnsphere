import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BadRequestError, NotAuthorizedError } from '../errors';
import { AnalyticsService } from '../services';
import { PaymentService } from '../services/payment.service';

export class PaymentController {
  public static async createOrder(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }
      const orderDetails = await PaymentService.createOrder(
        req.body,
        req.currentUser
      );

      res.status(StatusCodes.CREATED).json(orderDetails);
    } catch (error) {
      next(error);
    }
  }

  public static async handleWebhook(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const signature = req.headers['x-razorpay-signature'] as string;

      const rawBody = req.rawBody;

      if (!signature || !rawBody) {
        throw new BadRequestError(
          'Missing Razorpay signature or request body.'
        );
      }

      await PaymentService.handleWebhook(req.body, signature, rawBody);

      res.status(StatusCodes.OK).json({ status: 'ok' });
    } catch (error) {
      next(error);
    }
  }

  public static async getRevenueBreakdown(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }
      const breakdown = await AnalyticsService.getRevenueBreakdown(
        req.currentUser.id
      );
      res.status(StatusCodes.OK).json(breakdown);
    } catch (error) {
      next(error);
    }
  }

  public static async getFinancialTrends(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }
      const trends = await AnalyticsService.getFinancialTrends(
        req.currentUser.id
      );
      res.status(StatusCodes.OK).json(trends);
    } catch (error) {
      next(error);
    }
  }

  public static async getCourseRevenue(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const revenue = await AnalyticsService.getCourseRevenue(courseId);
      res.status(StatusCodes.OK).json(revenue);
    } catch (error) {
      next(error);
    }
  }

  public static async getCourseRevenueTrend(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const trend = await AnalyticsService.getCourseRevenueTrend(courseId);
      res.status(StatusCodes.OK).json(trend);
    } catch (error) {
      next(error);
    }
  }

  public static async getOverallRevenueStats(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();

      const stats = await AnalyticsService.getOverallRevenueStats(
        req.currentUser.id
      );

      res.status(StatusCodes.OK).json(stats);
    } catch (error) {
      next(error);
    }
  }
}
