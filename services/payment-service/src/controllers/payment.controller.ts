import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BadRequestError, NotAuthorizedError } from '../errors';
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
      const breakdown = await PaymentService.getRevenueBreakdown(
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
      const trends = await PaymentService.getFinancialTrends(
        req.currentUser.id
      );
      res.status(StatusCodes.OK).json(trends);
    } catch (error) {
      next(error);
    }
  }
}
