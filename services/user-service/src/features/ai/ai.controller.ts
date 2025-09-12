import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { NotAuthorizedError } from '../../errors';
import { AiService } from './ai.service';

export class AiController {
  private static aiService = new AiService();

  public static async handleTutorChat(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) {
        throw new NotAuthorizedError();
      }

      const { courseId, prompt } = req.body;
      const userId = req.currentUser.id;

      const responseText = await AiController.aiService.generateTutorResponse(
        userId,
        courseId,
        prompt
      );

      res.status(StatusCodes.OK).json({ response: responseText });
    } catch (error) {
      next(error);
    }
  }
}
