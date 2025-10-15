import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { NotAuthorizedError } from '../errors';
import { studyGoalQuerySchema } from '../schemas/study-goal.schema';
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

  public static async getInternalStudyGoal(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId, type } = studyGoalQuerySchema.parse({ query: req.query })[
        'query'
      ];

      const goal = await StudyGoalService.getGoalByUserAndType(userId, type);

      res.status(StatusCodes.OK).json(goal);
    } catch (error) {
      next(error);
    }
  }
}
