import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { BadRequestError, NotAuthorizedError } from '../errors';
import {
  courseDiscussionsParamsSchema,
  generateShareLinkSchema,
  inviteUsersSchema,
  messageParamsSchema,
  reactMessageSchema,
} from '../schemas';
import {
  conversationIdSchema,
  createConversationSchema,
  createGroupConversationSchema,
  discussionIdParamSchema,
  getMessagesSchema,
  postReplySchema,
  removeParticipantSchema,
  roomIdParamSchema,
  userIdSchema,
} from '../schemas/chat.schema';
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
      const { id } = getMessagesSchema.parse({ params: req.params }).params;
      const { page, limit } = getMessagesSchema.parse({
        query: req.query,
      }).query;
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
      const { recipientId } = createConversationSchema.parse({
        body: req.body,
      }).body;

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
      const { name, participantIds } = createGroupConversationSchema.parse({
        body: req.body,
      }).body;

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
      const { id: conversationId } = conversationIdSchema.parse({
        params: req.params,
      }).params;
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
      const { id: conversationId } = conversationIdSchema.parse({
        params: req.params,
      }).params;
      const { userId: userIdToAdd } = userIdSchema.parse({
        body: req.body,
      }).body;
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
      const { conversationId, userIdToRemove } = removeParticipantSchema.parse({
        params: req.params,
      }).params;
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
      const userId = req.currentUser!.id;
      if (!userId) throw new NotAuthorizedError();

      const discussions = await ChatService.getDiscussionsForCourse(
        courseId,
        userId
      );

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
      const { discussionId } = postReplySchema.parse({
        params: req.params,
      }).params;
      const { content } = postReplySchema.parse({ body: req.body }).body;

      const newReply = await ChatService.postReply(
        discussionId,
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
      const { discussionId: id } = discussionIdParamSchema.parse({
        params: req.body,
      }).params;

      await ChatService.toggleBookmark(id, req.currentUser);

      res.status(StatusCodes.OK).json({ message: 'Bookmark toggled.' });
    } catch (error) {
      next(error);
    }
  }

  public static async resolve(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { discussionId: id } = discussionIdParamSchema.parse({
        params: req.body,
      }).params;

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
      const { roomId } = roomIdParamSchema.parse({ params: req.params }).params;

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
      const { roomId } = roomIdParamSchema.parse({ params: req.params }).params;

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

      const { roomId } = roomIdParamSchema.parse({ params: req.params }).params;

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
      const { roomId } = roomIdParamSchema.parse({ params: req.params }).params;

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
      const { roomId } = generateShareLinkSchema.parse({
        params: req.params,
      }).params;
      const { expiresIn } = generateShareLinkSchema.parse({
        body: req.body,
      }).body;

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
      const { roomId } = inviteUsersSchema.parse({ params: req.params }).params;
      const { userIds } = inviteUsersSchema.parse({ body: req.body }).body;

      await ChatService.inviteUsersToRoom(roomId, userIds, req.currentUser);

      res
        .status(StatusCodes.OK)
        .json({ message: `Invitations sent to ${userIds.length} users.` });
    } catch (error) {
      next(error);
    }
  }

  public static async upvoteMessage(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { messageId } = messageParamsSchema.parse({
        params: req.params,
      }).params;

      const result = await ChatService.upvoteMessage(
        messageId,
        req.currentUser
      );

      res
        .status(result === 'added' ? StatusCodes.CREATED : StatusCodes.OK)
        .json({
          status: result,
          message:
            result === 'added'
              ? 'Upvote added successfully'
              : 'Upvote removed successfully',
        });
    } catch (error) {
      next(error);
    }
  }

  public static async downvoteMessage(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { messageId } = messageParamsSchema.parse({
        params: req.params,
      }).params;

      const result = await ChatService.downvoteMessage(
        messageId,
        req.currentUser
      );

      res
        .status(result === 'added' ? StatusCodes.CREATED : StatusCodes.OK)
        .json({
          status: result,
          message:
            result === 'added'
              ? 'Downvote added successfully'
              : 'Downvote removed successfully',
        });
    } catch (error) {
      next(error);
    }
  }

  public static async reactToMessage(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { reaction } = reactMessageSchema.parse({ body: req.body }).body;
      const { messageId } = reactMessageSchema.parse({
        params: req.params,
      }).params;

      const result = await ChatService.reactToMessage(
        messageId,
        reaction,
        req.currentUser
      );

      const statusCode =
        result === 'added' ? StatusCodes.CREATED : StatusCodes.OK;
      const message =
        result === 'added'
          ? `Reaction '${reaction}' added successfully`
          : result === 'updated'
            ? `Reaction updated to '${reaction}' successfully`
            : `Reaction '${reaction}' removed successfully`;

      res.status(statusCode).json({
        status: result,
        message,
        reaction,
      });
    } catch (error) {
      next(error);
    }
  }
}
