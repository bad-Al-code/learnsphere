import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { NotAuthorizedError } from '../../../errors';
import { AIFeedbackService } from '../services/assignmentFeedback.service';

export class AIFeedbackController {
  public static async getMyFeedback(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();

      const feedback = await AIFeedbackService.getFeedbackForUser(
        req.currentUser.id
      );

      res.status(StatusCodes.OK).json(feedback);
    } catch (error) {
      next(error);
    }
  }
}
