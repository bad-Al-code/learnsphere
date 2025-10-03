import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { NotAuthorizedError } from '../errors';
import { getMentorshipProgramsSchema } from '../schemas';
import { MentorshipService } from '../services';

export class MentorshipController {
  public static async getPrograms(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { query } = getMentorshipProgramsSchema.parse(req.body);

      const result = await MentorshipService.getPrograms(
        query,
        req.currentUser.id
      );

      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
}
