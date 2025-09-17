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

  public static async updateAssignment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { id } = req.params;
      const { title, content, prompt } = req.body;

      const updatedAssignment = await WritingService.updateAssignment(
        id,
        req.currentUser.id,
        { title, content, prompt }
      );

      res.status(StatusCodes.OK).json(updatedAssignment);
    } catch (error) {
      next(error);
    }
  }

  public static async deleteAssignment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { id } = req.params;

      await WritingService.deleteAssignment(id, req.currentUser.id);

      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }
}
