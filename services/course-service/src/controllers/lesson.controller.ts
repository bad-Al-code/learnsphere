import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { NotAuthorizedError } from '../errors';
import { LessonService } from '../services';

export class LessonController {
  public static async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { moduleId } = req.params;
      const lessonData = req.body;
      const requesterId = req.currentUser?.id;
      if (!requesterId) {
        throw new NotAuthorizedError();
      }

      const lesson = await LessonService.addLessonToModule(
        { ...lessonData, moduleId },
        requesterId
      );

      res.status(StatusCodes.CREATED).json(lesson);
    } catch (error) {
      next(error);
    }
  }
  public static async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { lessonId } = req.params;
      const lesson = await LessonService.getLessonDetails(lessonId);
      res.status(StatusCodes.OK).json(lesson);
    } catch (error) {
      next(error);
    }
  }

  public static async update(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { lessonId } = req.params;
      const requesterId = req.currentUser?.id;
      if (!requesterId) {
        throw new NotAuthorizedError();
      }

      const updatedLesson = await LessonService.updateLesson(
        lessonId,
        req.body,
        requesterId
      );
      res.status(StatusCodes.OK).json(updatedLesson);
    } catch (error) {
      next(error);
    }
  }

  public static async delete(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { lessonId } = req.params;
      const requesterId = req.currentUser?.id;
      if (!requesterId) {
        throw new NotAuthorizedError();
      }

      await LessonService.deleteLesson(lessonId, requesterId);
      res
        .status(StatusCodes.OK)
        .json({ message: 'Lesson deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  public static async reorder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { ids } = req.body;
      const requesterId = req.currentUser?.id;
      if (!requesterId) {
        throw new NotAuthorizedError();
      }

      await LessonService.reorderLessons(ids, requesterId);
      res
        .status(StatusCodes.OK)
        .json({ message: 'Lessons reordered successfully' });
    } catch (error) {
      next(error);
    }
  }

  public static async requestVideoUploadUrl(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { lessonId } = req.params;
      const { filename } = req.body;
      const requesterId = req.currentUser?.id;
      if (!requesterId) {
        throw new NotAuthorizedError();
      }

      const uploadData = await LessonService.requestVideoUploadUrl(
        lessonId,
        filename,
        requesterId
      );

      res.status(StatusCodes.OK).json(uploadData);
    } catch (error) {
      next(error);
    }
  }
}
