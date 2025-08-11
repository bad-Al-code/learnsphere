import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { NotAuthorizedError } from '../errors';
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
}
