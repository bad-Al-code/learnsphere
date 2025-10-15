import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { NotAuthorizedError } from '../errors';
import {
  createStudyGoalSchema,
  goalIdParamsSchema,
  studyGoalQuerySchema,
  updateStudyGoalSchema,
} from '../schemas';
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

  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const { body } = createStudyGoalSchema.parse({ body: req.body });
      const newGoal = await StudyGoalService.createGoal(body, req.currentUser);

      res.status(StatusCodes.CREATED).json(newGoal);
    } catch (error) {
      next(error);
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();

      const { goalId } = goalIdParamsSchema.parse({
        params: req.params,
      }).params;
      const { body } = updateStudyGoalSchema.parse({ body: req.body });

      const updatedGoal = await StudyGoalService.updateGoal(
        goalId,
        body,
        req.currentUser
      );

      res.status(StatusCodes.OK).json(updatedGoal);
    } catch (error) {
      next(error);
    }
  }

  public static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();

      const { goalId } = goalIdParamsSchema.parse({
        params: req.params,
      }).params;

      await StudyGoalService.deleteGoal(goalId, req.currentUser);

      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }
}
