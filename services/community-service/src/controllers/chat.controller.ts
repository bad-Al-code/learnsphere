import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { NotAuthorizedError } from '../errors';
import { ChatService } from '../services/chat.service';

export class ChatController {
  public static async getConversations(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.currentUser!.id;
      if (!userId) {
        throw new NotAuthorizedError();
      }

      const conversations = await ChatService.getConversationsForUser(userId);

      res.status(StatusCodes.OK).json(conversations);
    } catch (error) {
      next(error);
    }
  }

  public static async getMessages(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { page, limit } = req.query;
      const userId = req.currentUser!.id;
      if (!userId) {
        throw new NotAuthorizedError();
      }

      const messages = await ChatService.getMessagesForConversation(
        id,
        userId,
        { page: Number(page), limit: Number(limit) }
      );

      res.status(StatusCodes.OK).json(messages);
    } catch (error) {
      next(error);
    }
  }
}
