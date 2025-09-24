import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { DraftService } from '../services/draft.service';

export class DraftController {
  public static async getMyDrafts(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const drafts = await DraftService.getDrafts(req.currentUser!);
      res.status(StatusCodes.OK).json(drafts);
    } catch (e) {
      next(e);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        assignmentId,
        title,
        content,
        status,
        priority,
        category,
        wordCount,
      } = req.body;

      const newDraft = await DraftService.createDraft(
        {
          assignmentId,
          title,
          content,
          status,
          priority,
          category,
          wordCount,
          studentId: req.currentUser!.id,
        },
        req.currentUser!
      );

      res.status(StatusCodes.CREATED).json(newDraft);
    } catch (e) {
      next(e);
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { title, content, status, priority, category, wordCount } =
        req.body;

      const updatedDraft = await DraftService.update(
        id,
        { title, content, status, priority, category, wordCount },
        req.currentUser!
      );

      res.status(StatusCodes.OK).json(updatedDraft);
    } catch (e) {
      next(e);
    }
  }

  public static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      await DraftService.delete(id, req.currentUser!);

      res.status(StatusCodes.NO_CONTENT).send();
    } catch (e) {
      next(e);
    }
  }
}
