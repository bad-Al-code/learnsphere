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

      const { courseId, prompt, conversationId } = req.body;
      const userId = req.currentUser.id;

      const result = await AiController.aiService.generateTutorResponse(
        userId,
        courseId,
        prompt,
        conversationId
      );

      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  public static async createConversation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { courseId, title } = req.body;

      const conversation = await AiController.aiService.createNewConversation(
        req.currentUser.id,
        courseId,
        title
      );

      res.status(StatusCodes.CREATED).json(conversation);
    } catch (error) {
      next(error);
    }
  }

  public static async getConversations(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();

      const conversations =
        await AiController.aiService.getConversationsForUser(
          req.currentUser.id
        );

      res.status(StatusCodes.OK).json(conversations);
    } catch (error) {
      next(error);
    }
  }

  public static async renameConversation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { id } = req.params;
      const { title } = req.body;

      await AiController.aiService.renameConversation(
        id,
        title,
        req.currentUser.id
      );

      res
        .status(StatusCodes.OK)
        .json({ message: 'Conversation renamed successfully.' });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteConversation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { id } = req.params;

      await AiController.aiService.deleteConversation(id, req.currentUser.id);

      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }
}
