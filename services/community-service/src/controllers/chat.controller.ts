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

  public static async getReplies(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { id } = req.params;

      const replies = await ChatService.getRepliesForDiscussion(
        id,
        req.currentUser
      );

      res.status(StatusCodes.OK).json(replies);
    } catch (error) {
      next(error);
    }
  }

  public static async postReply(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { id } = req.params;
      const { content } = req.body;

      const newReply = await ChatService.postReply(
        id,
        content,
        req.currentUser
      );

      res.status(StatusCodes.CREATED).json(newReply);
    } catch (error) {
      next(error);
    }
  }

  public static async bookmark(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { id } = req.params;

      await ChatService.toggleBookmark(id, req.currentUser);

      res.status(StatusCodes.OK).json({ message: 'Bookmark toggled.' });
    } catch (error) {
      next(error);
    }
  }

  public static async resolve(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { id } = req.params;

      await ChatService.toggleResolved(id, req.currentUser);

      res.status(StatusCodes.OK).json({ message: 'Resolved status toggled.' });
    } catch (error) {
      next(error);
    }
  }

  public static async getStudyRooms(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { q, topic, limit, cursor } = req.query;
      const rooms = await ChatService.getStudyRooms({
        query: q as string,
        topic: topic as string,
        limit: Number(limit) || 9,
        cursor: cursor as string | undefined,
      });
      res.status(StatusCodes.OK).json(rooms);
    } catch (error) {
      next(error);
    }
  }

  public static async createStudyRoom(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();

      const newRoom = await ChatService.createStudyRoom(
        req.body,
        req.currentUser
      );

      res.status(StatusCodes.CREATED).json(newRoom);
    } catch (error) {
      next(error);
    }
  }

  public static async joinStudyRoom(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { roomId } = req.params;

      await ChatService.joinStudyRoom(roomId, req.currentUser);

      res
        .status(StatusCodes.OK)
        .json({ message: 'Successfully joined the room.' });
    } catch (error) {
      next(error);
    }
  }

  public static async updateStudyRoom(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { roomId } = req.params;

      const updatedRoom = await ChatService.updateStudyRoom(
        roomId,
        req.body,
        req.currentUser
      );

      res.status(StatusCodes.OK).json(updatedRoom);
    } catch (error) {
      next(error);
    }
  }

  public static async deleteStudyRoom(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { roomId } = req.params;

      await ChatService.deleteStudyRoom(roomId, req.currentUser);

      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }
  public static async scheduleReminder(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { roomId } = req.params;
      await ChatService.scheduleReminder(roomId, req.currentUser);
      res
        .status(StatusCodes.ACCEPTED)
        .json({ message: 'Reminder has been scheduled.' });
    } catch (error) {
      next(error);
    }
  }

  public static async generateShareLink(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { roomId } = req.params;
      const { expiresIn } = req.body;

      const result = await ChatService.generateShareLink(
        roomId,
        expiresIn,
        req.currentUser
      );

      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  public static async inviteUsersToRoom(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { roomId } = req.params;
      const { userIds } = req.body;

      await ChatService.inviteUsersToRoom(roomId, userIds, req.currentUser);

      res
        .status(StatusCodes.OK)
        .json({ message: `Invitations sent to ${userIds.length} users.` });
    } catch (error) {
      next(error);
    }
  }
}
