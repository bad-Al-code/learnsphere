import logger from '../config/logger';
import { rabbitMQConnection } from './connection';

export abstract class Publisher<T extends { topic: string; data: unknown }> {
  abstract topic: T['topic'];
  protected exchange = 'learnsphere';
  protected exchangeType = 'topic';

  async publish(data: T['data']): Promise<void> {
    const channel = rabbitMQConnection.getChannel();
    await channel.assertExchange(this.exchange, this.exchangeType, {
      durable: true,
    });

    const message = JSON.stringify(data);

    channel.publish(this.exchange, this.topic, Buffer.from(message));

    logger.info(
      `Event published to exchange '${this.exchange}' with topic '${this.topic}': %o`,
      data
    );
  }
}

interface UserProfileSyncEvent {
  topic: 'user.profile.sync';
  data: {
    userId: string;
    firstName: string | null;
    lastName: string | null;
    avatarUrl: string | null;
  };
}

export class UserProfileSyncPublisher extends Publisher<UserProfileSyncEvent> {
  readonly topic: 'user.profile.sync' = 'user.profile.sync' as const;
}

interface MessageSentEvent {
  topic: 'message.sent';
  data: {
    messageId: string;
    conversationId: string;
    senderId: string;
    senderName: string | null;
    recipientIds: string[];
    content: string;
    createdAt: string;
  };
}

export class MessageSentPublisher extends Publisher<MessageSentEvent> {
  readonly topic: 'message.sent' = 'message.sent' as const;
}
