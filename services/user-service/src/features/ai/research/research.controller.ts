import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { NotAuthorizedError } from '../../../errors';
import { ResearchService } from './research.service';

export class ResearchController {
  public static async handlePerformResearch(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { courseId, query } = req.body;

      const results = await ResearchService.performResearch(
        req.currentUser.id,
        courseId,
        query
      );

      res.status(StatusCodes.OK).json(results);
    } catch (error) {
      next(error);
    }
  }

  public static async getBoard(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { courseId } = req.query as { courseId: string };

      const board = await ResearchService.getBoard(
        req.currentUser.id,
        courseId
      );

      res.status(StatusCodes.OK).json(board);
    } catch (error) {
      next(error);
    }
  }
}
