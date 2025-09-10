import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BadRequestError, NotAuthorizedError } from '../errors';
import { conversationIdSchema } from '../schemas/chat.schema';
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

  public static async createConversation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const initiatorId = req.currentUser!.id;
      const { recipientId } = req.body;

      if (initiatorId === recipientId) {
        throw new BadRequestError(
          'You cannot start a conversation with yourself.'
        );
      }

      const conversation = await ChatService.createOrGetDirectConversation(
        initiatorId,
        recipientId
      );

      res.status(StatusCodes.CREATED).json(conversation);
    } catch (error) {
      next(error);
    }
  }

  public static async markAsRead(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id: conversationId } = conversationIdSchema.parse(req).params;
      const userId = req.currentUser!.id;

      await ChatService.markConversationAsRead(conversationId, userId);

      res.status(StatusCodes.OK).json({ message: 'Messages marked as read.' });
    } catch (error) {
      next(error);
    }
  }

  public static async createGroupConversation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const creatorId = req.currentUser!.id;
      const { name, participantIds } = req.body;

      const conversation = await ChatService.createGroupConversation(
        creatorId,
        name,
        participantIds
      );

      res.status(StatusCodes.CREATED).json(conversation);
    } catch (error) {
      next(error);
    }
  }
}
