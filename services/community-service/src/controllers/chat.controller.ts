import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BadRequestError, NotAuthorizedError } from '../errors';
import { courseDiscussionsParamsSchema } from '../schemas';
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

  public static async getParticipants(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id: conversationId } = req.params;
      const userId = req.currentUser!.id;
      const participants = await ChatService.getConversationParticipants(
        conversationId,
        userId
      );
      res.status(StatusCodes.OK).json(participants);
    } catch (error) {
      next(error);
    }
  }

  public static async addParticipant(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id: conversationId } = req.params;
      const { userId: userIdToAdd } = req.body;
      const requesterId = req.currentUser!.id;

      await ChatService.addParticipantToGroup(
        conversationId,
        userIdToAdd,
        requesterId
      );

      res.status(StatusCodes.OK).json({ message: 'User added to group.' });
    } catch (error) {
      next(error);
    }
  }

  public static async removeParticipant(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id: conversationId, userId: userIdToRemove } = req.params;
      const requesterId = req.currentUser!.id;

      await ChatService.removeParticipantFromGroup(
        conversationId,
        userIdToRemove,
        requesterId
      );

      res.status(StatusCodes.OK).json({ message: 'User removed from group.' });
    } catch (error) {
      next(error);
    }
  }

  public static async getPublicStudyGroups(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const groups = await ChatService.getPublicStudyGroups();

      res.status(StatusCodes.OK).json(groups);
    } catch (error) {
      next(error);
    }
  }

  public static async createDiscussion(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const newDiscussion = await ChatService.createDiscussion(
        req.body,
        req.currentUser
      );
      res.status(StatusCodes.CREATED).json(newDiscussion);
    } catch (error) {
      next(error);
    }
  }

  public static async getCourseDiscussions(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = courseDiscussionsParamsSchema.parse(req).params;
      const discussions = await ChatService.getDiscussionsForCourse(courseId);
      res.status(StatusCodes.OK).json(discussions);
    } catch (error) {
      next(error);
    }
  }
}
