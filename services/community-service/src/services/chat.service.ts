import { differenceInMilliseconds } from 'date-fns';
import jwt from 'jsonwebtoken';

import { webSocketService } from '..';
import { env } from '../config/env';
import logger from '../config/logger';
import { redisConnection } from '../config/redis';
import { ConversationRepository, MessageRepository } from '../db/repositories';
import { Conversation, NewConversation } from '../db/schema';
import { BadRequestError, ForbiddenError, NotFoundError } from '../errors';
import { ConflictError } from '../errors/conflic-error';
import {
  GroupUpdatedPublisher,
  StudyRoomReminderPublisher,
  UserInvitedToStudyRoomPublisher,
} from '../events/publisher';
import {
  CreateDiscussionDto,
  CreateStudyRoomDTO,
  Expiry,
  UpdateStudyRoomDto,
} from '../schemas';
import { Requester } from '../types';
import { ChatCacheService } from './cache.service';
import { ONLINE_USERS_KEY } from './presence.service';
import { UserService } from './user.service';

export class ChatService {
  /**
   * Fetches all conversations for a specific user.
   * @param userId The ID of the user.
   * @returns A list of enriched conversation objects.
   */
  public static async getConversationsForUser(userId: string) {
    const cachedConversations = await ChatCacheService.getConversations(userId);
    if (cachedConversations) {
      return cachedConversations;
    }

    const conversations = await ConversationRepository.findManyByUserId(userId);
    if (conversations.length === 0) {
      return [];
    }

    const conversationIds = conversations.map((c) => c.id);
    const unreadCounts = await MessageRepository.getUnreadCounts(
      conversationIds,
      userId
    );

    const redisClient = redisConnection.getClient();

    const enrichedConversations = await Promise.all(
      conversations.map(async (convo) => {
        let status: 'online' | 'offline' = 'offline';

        if (convo.otherParticipant?.id) {
          const isOnline = await redisClient.sIsMember(
            ONLINE_USERS_KEY,
            convo.otherParticipant.id
          );
          status = isOnline ? 'online' : 'offline';
        }
        return {
          ...convo,
          unreadCount: unreadCounts.get(convo.id) || 0,
          otherParticipant: convo.otherParticipant
            ? { ...convo.otherParticipant, status }
            : null,
        };
      })
    );

    if (enrichedConversations.length > 0) {
      await ChatCacheService.setConversations(userId, enrichedConversations);
    }

    return enrichedConversations;
  }

  /**
   * Fetches paginated messages for a given conversation, ensuring the user has access.
   * @param conversationId The ID of the conversation.
   * @param userId The ID of the user requesting the messages.
   * @param options Pagination options (page, limit).
   * @returns A list of message objects.
   * @throws {ForbiddenError} If the user is not a participant of the conversation.
   */
  public static async getMessagesForConversation(
    conversationId: string,
    userId: string,
    options: { page: number; limit: number }
  ) {
    const isParticipant = await ConversationRepository.isUserParticipant(
      conversationId,
      userId
    );

    if (!isParticipant) {
      throw new ForbiddenError(
        'You are not authorized to view messages in this conversation.'
      );
    }

    const offset = (options.page - 1) * options.limit;
    return MessageRepository.findManyByConversationId(
      conversationId,
      options.limit,
      offset
    );
  }

  /**
   * Finds a direct conversation between two users, creating one if it doesn't exist.
   * @param initiatorId The ID of the user starting the conversation.
   * @param recipientId The ID of the user being messaged.
   * @returns The existing or newly created conversation.
   */
  public static async createOrGetDirectConversation(
    initiatorId: string,
    recipientId: string
  ) {
    try {
      await Promise.all([
        UserService.findOrFetchUser(initiatorId),
        UserService.findOrFetchUser(recipientId),
      ]);
    } catch (error) {
      logger.error('Failed to find or fetch users for new conversation', {
        initiatorId,
        recipientId,
        error,
      });

      throw new BadRequestError('One or more users could not be found.');
    }

    const existingConversation =
      await ConversationRepository.findDirectConversation(
        initiatorId,
        recipientId
      );

    if (existingConversation) {
      return existingConversation;
    }

    const newConversation = await ConversationRepository.create(
      { type: 'direct' },
      [initiatorId, recipientId]
    );

    await ChatCacheService.invalidateConversations(initiatorId);
    await ChatCacheService.invalidateConversations(recipientId);

    return newConversation;
  }

  /**
   * Marks all messages in a conversation as read by a specific user.
   * @param conversationId The ID of the conversation.
   * @param userId The ID of the user marking the messages as read.
   */
  public static async markConversationAsRead(
    conversationId: string,
    userId: string
  ): Promise<void> {
    const isParticipant = await ConversationRepository.isUserParticipant(
      conversationId,
      userId
    );
    if (!isParticipant) {
      throw new ForbiddenError('Access Denied.');
    }

    await Promise.all([
      MessageRepository.markMessagesAsRead(conversationId, userId),
      ConversationRepository.updateLastReadTimestamp(conversationId, userId),
    ]);

    logger.info(
      `User ${userId} marked conversation ${conversationId} as read.`
    );

    if (webSocketService) {
      await webSocketService.broadcastMessagesRead(conversationId, userId);
    } else {
      logger.warn('WebSocketService not available to broadcast read receipt.');
    }
  }

  /**
   * Creates a new group conversation.
   * @param creatorId The ID of the user creating the group.
   * @param name The name of the group.
   * @param participantIds An array of user IDs to include in the group.
   * @returns The newly created group conversation.
   */
  public static async createGroupConversation(
    creatorId: string,
    name: string,
    participantIds: string[]
  ) {
    const allParticipantIds = [...new Set([creatorId, ...participantIds])];
    if (allParticipantIds.length < 2) {
      throw new BadRequestError('Group chats must have at least two members.');
    }

    try {
      await Promise.all(
        allParticipantIds.map((id) => UserService.findOrFetchUser(id))
      );
    } catch (error) {
      logger.error('Failed to find or fetch one or more users for new group', {
        participantIds: allParticipantIds,
        error,
      });

      throw new BadRequestError(
        'One or more users could not be found and a group could not be created.'
      );
    }

    logger.info(
      `Creating group chat "${name}" with ${allParticipantIds.length} members.`
    );

    logger.info(
      `Creating group chat "${name}" with ${allParticipantIds.length} members.`
    );

    try {
      const conversationData: NewConversation = {
        type: 'group',
        name,
        createdById: creatorId,
      };
      const newConversation = await ConversationRepository.create(
        conversationData,
        allParticipantIds
      );

      const invalidationPromises = allParticipantIds.map((id) =>
        ChatCacheService.invalidateConversations(id)
      );
      await Promise.all(invalidationPromises);

      return newConversation;
    } catch (error: any) {
      if (error.code === '23505') {
        throw new BadRequestError(
          `A group with the name "${name}" already exists.`
        );
      }
      throw error;
    }
  }

  /**
   * Toggles an emoji reaction for a user on a specific message.
   * @param messageId The ID of the message.
   * @param userId The ID of the user reacting.
   * @param emoji The emoji used for the reaction.
   */
  public static async toggleMessageReaction(
    messageId: string,
    userId: string,
    emoji: string
  ) {
    const message = await MessageRepository.findById(messageId);
    if (!message) {
      throw new NotFoundError('Message');
    }

    const isParticipant = await ConversationRepository.isUserParticipant(
      message.conversationId,
      userId
    );
    if (!isParticipant)
      throw new ForbiddenError(
        'You cannot react to message in this conversation.'
      );

    const updatedReactions = await MessageRepository.toggleReaction(
      messageId,
      userId,
      emoji
    );

    if (webSocketService) {
      await webSocketService.broadcastReactionUpdate(
        message.conversationId,
        messageId,
        updatedReactions || {}
      );
    }
  }

  /**
   * Retrieves the list of participants for a given conversation.
   * @param conversationId The ID of the conversation.
   * @param userId The ID of the user making the request (for auth check).
   */
  public static async getConversationParticipants(
    conversationId: string,
    userId: string
  ) {
    const isParticipant = await ConversationRepository.isUserParticipant(
      conversationId,
      userId
    );
    if (!isParticipant) {
      throw new ForbiddenError('You are not a member of this conversation.');
    }

    return ConversationRepository.findParticipantsWithDetails(conversationId);
  }

  /**
   * Add a participant to a group conversation.
   * @throws ForbiddenError if user is not group creator
   */
  public static async addParticipantToGroup(
    conversationId: string,
    userIdToAdd: string,
    requesterId: string
  ) {
    const conversation = await ConversationRepository.findById(conversationId);

    if (
      !conversation ||
      conversation.type !== 'group' ||
      conversation.createdById !== requesterId
    ) {
      throw new ForbiddenError(
        'You are not authorized to add members to this group.'
      );
    }

    await ConversationRepository.addParticipant(conversationId, userIdToAdd);

    try {
      const publisher = new GroupUpdatedPublisher();

      await publisher.publish({ conversationId });
    } catch (err) {
      logger.error('Failed to publish group update event', err);
    }
  }

  /**
   * Remove a participant from a group conversation.
   * @throws ForbiddenError if user is not group creator
   * @throws BadRequestError if user tries to remove themselves
   */
  public static async removeParticipantFromGroup(
    conversationId: string,
    userIdToRemove: string,
    requesterId: string
  ) {
    const conversation = await ConversationRepository.findById(conversationId);

    if (
      !conversation ||
      conversation.type !== 'group' ||
      conversation.createdById !== requesterId
    ) {
      throw new ForbiddenError(
        'You are not authorized to remove members from this group.'
      );
    }

    if (userIdToRemove === requesterId) {
      throw new BadRequestError(
        'You cannot remove yourself from a group you created.'
      );
    }

    await ConversationRepository.removeParticipant(
      conversationId,
      userIdToRemove
    );

    try {
      const publisher = new GroupUpdatedPublisher();

      await publisher.publish({ conversationId });
    } catch (err) {
      logger.error('Failed to publish group update event', err);
    }
  }

  /**
   * Retrieves a list of public study groups.
   * @returns A formatted list of study groups with participant info.
   */
  public static async getPublicStudyGroups() {
    const groups = await ConversationRepository.findPublicGroups(5);

    return groups.map((group) => ({
      id: group.id,
      title: group.name,
      description: group.description,
      isLive: group.isLive,
      category: group.category,
      duration: `${group.durationMinutes || 0}m`,
      startTime: group.startTime
        ? group.startTime.toISOString()
        : 'Not scheduled',
      participants: group.participants.map((p) => ({
        name: p.user?.name || 'Unknown',
        avatarUrl: p.user?.avatarUrl || null,
      })),
      participantCount: group.participants.length,
      maxParticipants: group.maxParticipants,
    }));
  }

  /**
   * Creates a new discussion for a course or assignment.
   * Checks for uniqueness of the discussion name per creator and throws a ConflictError if it already exists.
   * @param data - The discussion data including name, courseId, assignmentId, content, and optional tags.
   * @param requester - The user creating the discussion.
   * @returns The newly created discussion object.
   */
  public static async createDiscussion(
    data: CreateDiscussionDto,
    requester: Requester
  ) {
    const existing = await ConversationRepository.findByNameAndCreator(
      data.name,
      requester.id
    );

    if (existing) {
      throw new ConflictError(
        `You already have a discussion with name "${data.name}"`
      );
    }

    const newDiscussion = await ConversationRepository.create(
      {
        type: 'group',
        name: data.name,
        createdById: requester.id,
        courseId: data.courseId,
        assignmentId: data.assignmentId,
        tags: data.tags,
        description: data.content,
      },
      [requester.id]
    );

    await MessageRepository.create({
      conversationId: newDiscussion.id,
      senderId: requester.id,
      content: data.content,
    });

    return newDiscussion;
  }

  /**
   * Retrieves all discussions for a given course.
   * Maps the discussions to a simplified structure including author name, replies, and metadata.
   *
   * @param courseId - The ID of the course to fetch discussions for.
   * @returns An array of mapped discussion objects for the course.
   */
  public static async getDiscussionsForCourse(courseId: string) {
    const discussions =
      await ConversationRepository.findDiscussionsByCourse(courseId);

    return discussions.map((d) => ({
      id: d.id,
      title: d.name,
      course: d.courseId,
      author:
        d.participants.find((p) => p.userId === d.createdById)?.user.name ||
        'Anonymous',
      replies: 0,
      lastReply: 'N/A',
      isResolved: d.isResolved,
      isBookmarked: false,
      views: d.views,
      tags: d.tags,
    }));
  }

  /**
   * Retrieves all replies for a discussion if the requester is a participant.
   *
   * @param discussionId - The ID of the discussion to fetch replies for
   * @param requester - The user making the request
   * @returns An array of replies for the discussion
   */
  public static async getRepliesForDiscussion(
    discussionId: string,
    requester: Requester
  ) {
    const isParticipant = await ConversationRepository.isUserParticipant(
      discussionId,
      requester.id
    );
    if (!isParticipant) throw new ForbiddenError();

    return ConversationRepository.findReplies(discussionId);
  }

  /**
   * Posts a reply to a discussion if the requester is a participant.
   *
   * @param discussionId - The ID of the discussion to reply to
   * @param content - The content of the reply
   * @param requester - The user making the request
   * @returns The newly created message
   */
  public static async postReply(
    discussionId: string,
    content: string,
    requester: Requester
  ) {
    const isParticipant = await ConversationRepository.isUserParticipant(
      discussionId,
      requester.id
    );
    if (!isParticipant) throw new ForbiddenError();

    return MessageRepository.create({
      conversationId: discussionId,
      senderId: requester.id,
      content: content,
    });
  }

  /**
   * Toggles the bookmark status for a discussion for the requester.
   *
   * @param discussionId - The ID of the discussion
   * @param requester - The user making the request
   */
  public static async toggleBookmark(
    discussionId: string,
    requester: Requester
  ) {
    const isParticipant = await ConversationRepository.isUserParticipant(
      discussionId,
      requester.id
    );
    if (!isParticipant) throw new ForbiddenError();

    await ConversationRepository.toggleBookmark(discussionId, requester.id);
  }

  /**
   * Toggles the resolved status of a discussion.
   *
   * @param discussionId - The ID of the discussion
   * @param requester - The user making the request
   */
  public static async toggleResolved(
    discussionId: string,
    requester: Requester
  ) {
    const discussion = await ConversationRepository.findById(discussionId);
    if (!discussion || discussion.createdById !== requester.id) {
      throw new ForbiddenError(
        'Only the original author can resolve this discussion.'
      );
    }

    await ConversationRepository.toggleResolved(discussionId);
  }

  /**
   * Retrieves and formats study room data for API responses.
   * - Queries raw rooms using `findStudyRooms`.
   * - Maps rooms into a normalized shape for clients.
   * - Supports pagination with `cursor`.
   * @param options.query  Optional search string for room names.
   * @param options.topic  Optional topic filter ("all" returns all topics).
   * @param options.limit  Maximum number of rooms to return.
   * @param options.cursor Optional UUID for pagination.
   * @returns Object containing `rooms` array and `nextCursor` for pagination.
   */
  public static async getStudyRooms(options: {
    query?: string;
    topic?: string;
    limit: number;
    cursor?: string;
  }) {
    const rooms = await ConversationRepository.findStudyRooms(options);
    let nextCursor: string | null = null;
    if (rooms.length === options.limit) {
      const lastRoom = rooms[rooms.length - 1];

      nextCursor = lastRoom.id;
    }

    const formattedRooms = rooms.map((room) => ({
      id: room.id,
      title: room.name,
      subtitle: room.description,
      hostId: room.createdById,
      host: `Hosted By ${room.participants.find((p) => p.userId === room.createdById)?.user.name || '...'}`,
      participants: room.participants.length,
      maxParticipants: room.maxParticipants,
      duration: `${room.durationMinutes || 0}m`,
      tags: room.tags,
      progress: Math.floor(
        (room.participants.length / (room.maxParticipants || 1)) * 100
      ),
      isLive: room.isLive,
      isPrivate: room.isPrivate,
      time: room.startTime,
    }));

    return { rooms: formattedRooms, nextCursor };
  }

  /**
   * Creates a new study room for the requesting user.
   * @param data - The data for the new study room (title, description, category, etc.).
   * @param requester - The user creating the study room.
   * @returns The newly created Conversation object representing the study room.
   */
  public static async createStudyRoom(
    data: CreateStudyRoomDTO,
    requester: Requester
  ): Promise<Conversation> {
    const existing = await ConversationRepository.findByNameAndCreator(
      data.title,
      requester.id
    );
    if (existing) {
      throw new BadRequestError(
        `You already have a study room named "${data.title}".`
      );
    }

    const isLive = data.sessionType === 'now';
    const startTime = isLive
      ? new Date()
      : data.startTime
        ? new Date(data.startTime)
        : undefined;

    const newRoom = await ConversationRepository.create(
      {
        type: 'group',
        name: data.title,
        createdById: requester.id,
        description: data.description,
        category: data.category,
        tags: data.tags,
        maxParticipants: data.maxParticipants,
        isPrivate: data.isPrivate,
        durationMinutes: data.durationMinutes,
        startTime,
        isLive,
      },
      [requester.id]
    );

    return newRoom;
  }

  /**
   * Adds a user to a study room if it exists, is not full, and they are not already a participant.
   * @param roomId - The ID of the study room to join
   * @param requester - The authenticated user requesting to join
   */
  public static async joinStudyRoom(roomId: string, requester: Requester) {
    const room = await ConversationRepository.findById(roomId);
    if (!room || room.type !== 'group') {
      throw new NotFoundError('Study room not found.');
    }

    const participants =
      await ConversationRepository.findParticipantIds(roomId);
    if (participants.length >= (room.maxParticipants || 10)) {
      throw new BadRequestError('This study room is already full.');
    }

    if (participants.includes(requester.id)) {
      logger.warn(
        `User ${requester.id} is already in room ${roomId}. Ignoring join request.`
      );
      return;
    }

    await ConversationRepository.addParticipant(roomId, requester.id);

    logger.info(`User ${requester.id} successfully joined room ${roomId}`);
  }

  /**
   * Updates a study room if the requester is the creator.
   * @param roomId - The unique ID of the study room to update
   * @param data - Fields to update on the study room
   * @param requester - The authenticated user making the request
   * @returns The updated study room
   */
  public static async updateStudyRoom(
    roomId: string,
    data: UpdateStudyRoomDto,
    requester: Requester
  ): Promise<Conversation> {
    const room = await ConversationRepository.findById(roomId);
    if (!room || room.createdById !== requester.id) {
      throw new ForbiddenError();
    }

    return ConversationRepository.update(roomId, data);
  }

  /**
   * Deletes a study room if the requester is the creator.
   * @param roomId - The unique ID of the study room to delete
   * @param requester - The authenticated user making the request
   */
  public static async deleteStudyRoom(roomId: string, requester: Requester) {
    const room = await ConversationRepository.findById(roomId);
    if (!room || room.createdById !== requester.id) {
      throw new ForbiddenError();
    }

    await ConversationRepository.delete(roomId);
  }

  public static async scheduleReminder(roomId: string, requester: Requester) {
    const room = await ConversationRepository.findById(roomId);
    if (!room || !room.startTime) {
      throw new NotFoundError('Scheduled study room not found.');
    }

    const reminderTime = new Date(room.startTime).getTime() - 15 * 60 * 1000;
    const delayMilliseconds = differenceInMilliseconds(
      reminderTime,
      new Date()
    );
    if (delayMilliseconds <= 0) {
      throw new BadRequestError(
        'Cannot schedule a reminder for a room that is starting in less than 15 minutes or has already started.'
      );
    }

    const publisher = new StudyRoomReminderPublisher();
    await publisher.publish(
      {
        userId: requester.id,
        roomId: room.id,
        roomTitle: room.name!,
        startTime: room.startTime.toISOString(),
      },
      { expiration: delayMilliseconds }
    );

    logger.info(
      `Scheduled reminder for user ${requester.id} for room ${roomId}`
    );
  }

  /**
   * Generates a shareable link for a conversation room.
   * @param roomId - The UUID of the room to generate the link for.
   * @param expiresIn - Expiry duration of the link ('1hour', '24hours', '7days', or 'never').
   * @param requester - The user requesting the share link, must be the room creator.
   * @returns An object containing the generated share link.
   */
  public static async generateShareLink(
    roomId: string,
    expiresIn: Expiry,
    requester: Requester
  ): Promise<{
    shareLink: string;
  }> {
    const room = await ConversationRepository.findById(roomId);
    if (!room || room.createdById !== requester.id) {
      throw new ForbiddenError();
    }

    const expiresInMap: Record<
      Exclude<Expiry, 'never'>,
      jwt.SignOptions['expiresIn']
    > = {
      '1hour': '1h',
      '24hours': '24h',
      '7days': '7d',
    };

    const payload = { roomId };
    const options: jwt.SignOptions = {};
    if (expiresIn !== 'never') {
      options.expiresIn = expiresInMap[expiresIn];
    }

    const token = jwt.sign(payload, env.JWT_SECRET, options);
    const shareLink = `${process.env.CLIENT_URL || 'http://localhost:3000'}/student/community/join-room?token=${token}`;

    return { shareLink };
  }

  /**
   * Invites multiple users to a study room by publishing invitation events.
   * @param roomId - The ID of the study room to which users are being invited.
   * @param userIds - An array of user IDs to invite.
   * @param requester - The user initiating the invitations.
   * @returns {Promise<void>} Resolves when all invitation events have been published.
   */
  public static async inviteUsersToRoom(
    roomId: string,
    userIds: string[],
    requester: Requester
  ) {
    const room = await ConversationRepository.findById(roomId);
    if (!room) throw new NotFoundError('Study room not found.');

    const publisher = new UserInvitedToStudyRoomPublisher();
    const publishPromises = userIds.map((userId) => {
      return publisher.publish({
        inviterId: requester.id,
        inviteeId: userId,
        roomId: room.id,
        roomTitle: room.name!,
      });
    });

    await Promise.all(publishPromises);

    logger.info(
      `Published ${userIds.length} invitation events for room ${roomId}`
    );
  }
}
