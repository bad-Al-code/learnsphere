import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import z from 'zod';
import logger from '../../config/logger';
import { NotAuthorizedError } from '../../errors';
import { requestRecheckParamsSchema } from './ai.schema';
import { AIFeedbackService } from './ai.service';

export class AIController {
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

  public static async requestRecheck(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { submissionId } = requestRecheckParamsSchema.parse(req.params);

      AIFeedbackService.generateFeedback(
        submissionId,
        req.currentUser.id
      ).catch((err) => {
        logger.error(
          `Async error during feedback generation for submission ${submissionId}: %o`,
          { error: err }
        );
      });

      res.status(StatusCodes.ACCEPTED).json({
        message:
          'Your recheck request has been submitted. You will be notified when it is complete.',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(StatusCodes.BAD_REQUEST).json({ errors: error.errors });
        return;
      }

      next(error);
    }
  }
}
