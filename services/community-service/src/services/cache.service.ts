import logger from '../config/logger';
import { redisConnection } from '../config/redis';
import { Conversation } from '../db/schema';

const CONVERSATION_LIST_KEY = (userId: string) =>
  `conversations:user:${userId}`;
const CONVERSATION_LIST_TTL = 300; // 5 min

export class ChatCacheService {
  /**
   * Retrieves a user's conversation list from the cache.
   * @param userId The ID of the user.
   * @returns The cached list of conversations or null if not found.
   */
  public static async getConversations(
    userId: string
  ): Promise<Conversation[] | null> {
    try {
      const client = redisConnection.getClient();

      const data = await client.get(CONVERSATION_LIST_KEY(userId));
      if (data) {
        logger.debug(`Cache HIT for conversations: ${userId}`);

        return JSON.parse(data);
      }

      logger.debug(`Cache MISS for conversations: ${userId}`);

      return null;
    } catch (error) {
      logger.error('Error getting conversations from Redis cache', {
        userId,
        error,
      });

      return null;
    }
  }

  /**
   * Stores a user's conversation list in the cache.
   * @param userId The ID of the user.
   * @param conversations The list of conversations to cache.
   */
  public static async setConversations(
    userId: string,
    conversations: any[]
  ): Promise<void> {
    try {
      const client = redisConnection.getClient();

      await client.set(
        CONVERSATION_LIST_KEY(userId),
        JSON.stringify(conversations),
        { EX: CONVERSATION_LIST_TTL }
      );

      logger.debug(`Cache SET for conversations: ${userId}`);
    } catch (error) {
      logger.error('Error setting conversations in Redis cache', {
        userId,
        error,
      });
    }
  }

  /**
   * Deletes a user's conversation list from the cache.
   * @param userId The ID of the user whose cache to invalidate.
   */
  public static async invalidateConversations(userId: string): Promise<void> {
    try {
      const client = redisConnection.getClient();

      await client.del(CONVERSATION_LIST_KEY(userId));

      logger.info(`Cache INVALIDATED for conversations: ${userId}`);
    } catch (error) {
      logger.error('Error invalidating conversations in Redis cache', {
        userId,
        error,
      });
    }
  }
}
