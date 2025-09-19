import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { NotAuthorizedError } from '../errors';
import { StudyGoalService } from '../services/study-goal.service';

export class StudyGoalController {
  public static async getMyGoals(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();

      const goals = await StudyGoalService.getGoalsForUser(req.currentUser!.id);

      res.status(StatusCodes.OK).json(goals);
    } catch (error) {
      next(error);
    }
  }
}
