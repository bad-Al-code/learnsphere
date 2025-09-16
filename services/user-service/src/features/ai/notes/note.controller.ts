import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { NotAuthorizedError } from '../../../errors';
import { NoteService } from './note.service';

export class NoteController {
  public static async getNotes(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { courseId } = req.query as { courseId: string };

      const notes = await NoteService.getNotesForCourse(
        req.currentUser.id,
        courseId
      );

      res.status(StatusCodes.OK).json(notes);
    } catch (error) {
      next(error);
    }
  }

  public static async createNote(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { courseId, title, content } = req.body;

      const newNote = await NoteService.createNote(
        req.currentUser.id,
        courseId,
        title,
        content
      );

      res.status(StatusCodes.CREATED).json(newNote);
    } catch (error) {
      next(error);
    }
  }

  public static async updateNote(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { noteId, title, content } = req.body;

      const updatedNote = await NoteService.updateNote(
        noteId,
        req.currentUser.id,
        { title, content }
      );

      res.status(StatusCodes.OK).json(updatedNote);
    } catch (error) {
      next(error);
    }
  }

  public static async deleteNote(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { noteId } = req.body;

      await NoteService.deleteNote(noteId, req.currentUser.id);

      res.sendStatus(StatusCodes.NO_CONTENT);
    } catch (error) {
      next(error);
    }
  }

  public static async handleAnalyzeNote(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();

      const { noteId } = req.params;

      const updatedNote = await NoteService.analyzeNote(
        noteId,
        req.currentUser.id
      );

      res.status(StatusCodes.OK).json(updatedNote);
    } catch (error) {
      next(error);
    }
  }
}
