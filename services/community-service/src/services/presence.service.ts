import { RedisClientType } from 'redis';
import logger from '../config/logger';
import { redisConnection } from '../config/redis';
import { ConversationRepository } from '../db/repositories';
import { WebSocketService } from './websocket.service';

const PRESENCE_CHANNEL = 'presence-channel';

type PresenceMessage = {
  type: 'user.online' | 'user.offline';
  payload: {
    userId: string;
  };
};

export class PresenceService {
  private publisher: RedisClientType;
  private subscriber: RedisClientType;
  private webSocketService: WebSocketService;

  constructor(webSocketService: WebSocketService) {
    this.publisher = redisConnection.getPublisher();
    this.subscriber = redisConnection.getSubscriber();
    this.webSocketService = webSocketService;

    this.subscriber.subscribe(PRESENCE_CHANNEL, (message) => {
      this.handlePresenceMessage(message);
    });

    logger.info(`Subscribed to Redis channel: ${PRESENCE_CHANNEL}`);
  }

  public async userDidConnect(userId: string): Promise<void> {
    const message: PresenceMessage = {
      type: 'user.online',
      payload: { userId },
    };

    await this.publisher.publish(PRESENCE_CHANNEL, JSON.stringify(message));
  }

  public async userDidDisconnect(userId: string): Promise<void> {
    const message: PresenceMessage = {
      type: 'user.offline',
      payload: { userId },
    };

    await this.publisher.publish(PRESENCE_CHANNEL, JSON.stringify(message));
  }

  private async handlePresenceMessage(rawMessage: string): Promise<void> {
    try {
      const message: PresenceMessage = JSON.parse(rawMessage);
      const { userId } = message.payload;
      const status = message.type === 'user.online' ? 'online' : 'offline';

      logger.info(`Received presence update for user ${userId}: ${status}`);

      const conversations =
        await ConversationRepository.findManyByUserIdSimple(userId);
      const conversationIds = conversations.map((c) => c.id);

      if (conversationIds.length === 0) return;

      const participants =
        await ConversationRepository.findParticipantsForConversations(
          conversationIds
        );

      const userIdsToNotify = [
        ...new Set(participants.map((p) => p.userId)),
      ].filter((id) => id !== userId);

      for (const recipientId of userIdsToNotify) {
        this.webSocketService.sendPresenceUpdate(recipientId, userId, status);
      }
    } catch (error) {
      logger.error('Error handling presence message from Redis', { error });
    }
  }
}
