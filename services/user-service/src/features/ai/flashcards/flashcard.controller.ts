import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { NotAuthorizedError } from '../../../errors';
import { FlashcardService } from './flashcard.service';

export class FlashcardController {
  public static async createDeck(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { courseId, title } = req.body;

      const newDeck = await FlashcardService.createDeck(
        req.currentUser.id,
        courseId,
        title
      );

      res.status(StatusCodes.CREATED).json(newDeck);
    } catch (error) {
      next(error);
    }
  }

  public static async getDecks(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { courseId } = req.query as { courseId: string };

      const decks = await FlashcardService.getDecks(
        req.currentUser.id,
        courseId
      );

      res.status(StatusCodes.OK).json(decks);
    } catch (error) {
      next(error);
    }
  }
}
