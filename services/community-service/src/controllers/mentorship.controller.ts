import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import logger from '../config/logger';
import { NotAuthorizedError } from '../errors';
import { becomeMentorSchema, getMentorshipProgramsSchema } from '../schemas';
import { MentorshipService } from '../services';

export class MentorshipController {
  public static async getPrograms(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { query } = getMentorshipProgramsSchema.parse({ query: req.query });

      const result = await MentorshipService.getPrograms(
        query,
        req.currentUser?.id
      );

      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  public static async applyToBeMentor(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { body } = becomeMentorSchema.parse({ body: req.body });

      const application = await MentorshipService.applyToBeMentor(
        body,
        req.currentUser
      );

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Application submitted successfully',
        data: application,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getMentorshipStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const status = await MentorshipService.getMentorshipStatus(
        req.currentUser
      );

      res.status(StatusCodes.OK).json({
        success: true,
        data: status,
      });
    } catch (error) {
      logger.error('Error in getMentorshipStatus controller: %o', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: req.currentUser?.id,
      });

      next(error);
    }
  }
}
