import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { NotAuthorizedError } from '../../../errors';
import { WritingService } from './writing.service';

export class WritingController {
  public static async getAssignments(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { courseId } = req.query as { courseId: string };

      const assignments = await WritingService.getAssignments(
        req.currentUser.id,
        courseId
      );

      res.status(StatusCodes.OK).json(assignments);
    } catch (error) {
      next(error);
    }
  }

  public static async createAssignment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { courseId, title, prompt, content } = req.body;

      const newAssignment = await WritingService.createAssignment(
        req.currentUser.id,
        courseId,
        title,
        prompt,
        content
      );

      res.status(StatusCodes.CREATED).json(newAssignment);
    } catch (error) {
      next(error);
    }
  }
}
