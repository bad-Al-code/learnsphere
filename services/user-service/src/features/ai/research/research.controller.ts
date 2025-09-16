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

  public static async saveFinding(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { courseId, finding } = req.body;
      const newFinding = await ResearchService.saveFinding(
        req.currentUser.id,
        courseId,
        finding
      );
      res.status(StatusCodes.CREATED).json(newFinding);
    } catch (error) {
      next(error);
    }
  }

  public static async updateFindingNotes(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { id } = req.params;
      const { userNotes } = req.body;
      const updatedFinding = await ResearchService.updateFindingNotes(
        id,
        req.currentUser.id,
        userNotes
      );
      res.status(StatusCodes.OK).json(updatedFinding);
    } catch (error) {
      next(error);
    }
  }

  public static async deleteFinding(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { id } = req.params;
      await ResearchService.deleteFinding(id, req.currentUser.id);
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }

  public static async summarizeFinding(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { id } = req.params;
      const summarizedFinding = await ResearchService.summarizeFinding(
        id,
        req.currentUser.id
      );
      res.status(StatusCodes.OK).json(summarizedFinding);
    } catch (error) {
      next(error);
    }
  }
}
