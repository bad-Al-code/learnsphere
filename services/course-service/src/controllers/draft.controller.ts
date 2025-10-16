import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { DraftRepository } from '../db/repostiories';
import { NotAuthorizedError } from '../errors';
import {
  logTimeParamSchema,
  logTimeSchema,
  timeSummaryQuerySchema,
} from '../schemas';
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

  public static async addCollaborator(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { id } = req.params;
      const { email } = req.body;

      await DraftService.addCollaborator(id, email, req.currentUser);

      res
        .status(StatusCodes.OK)
        .json({ message: 'Collaborator added successfully.' });
    } catch (error) {
      next(error);
    }
  }

  public static async share(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { id } = req.params;

      const result = await DraftService.generateShareLink(id, req.currentUser);

      res.status(StatusCodes.OK).json(result);
    } catch (e) {
      next(e);
    }
  }

  public static async getShared(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { token } = req.params;

      const draft = await DraftService.getSharedDraft(token);

      res.status(StatusCodes.OK).json(draft);
    } catch (error) {
      next(error);
    }
  }

  public static async logTime(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { id } = logTimeParamSchema.parse({ params: req.params })['params'];
      const { minutes } = logTimeSchema.parse({ body: req.body })['body'];

      await DraftService.logTime(id, minutes, req.currentUser);

      res.status(StatusCodes.OK).json({ message: 'Time logged successfully.' });
    } catch (e) {
      next(e);
    }
  }

  public static async getTimeSummary(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { studentId, courseIds } = timeSummaryQuerySchema.parse({
        query: req.query,
      })['query'];

      const totalHours = await DraftRepository.getTotalAssignmentTime(
        studentId,
        courseIds
      );
      res.status(StatusCodes.OK).json({ activity: 'Assignments', totalHours });
    } catch (e) {
      next(e);
    }
  }
}
