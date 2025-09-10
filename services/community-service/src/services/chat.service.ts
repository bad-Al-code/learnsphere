import { webSocketService } from '..';
import logger from '../config/logger';
import { redisConnection } from '../config/redis';
import { ConversationRepository, MessageRepository } from '../db/repositories';
import { BadRequestError, ForbiddenError } from '../errors';
import { ONLINE_USERS_KEY } from './presence.service';
import { UserService } from './user.service';

export class ChatService {
  /**
   * Fetches all conversations for a specific user.
   * @param userId The ID of the user.
   * @returns A list of enriched conversation objects.
   */
  public static async getConversationsForUser(userId: string) {
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
}
