import { Options } from 'amqplib';
import logger from '../config/logger';
import { rabbitMQConnection } from './connection';

export abstract class Publisher<T extends { topic: string; data: unknown }> {
  abstract topic: T['topic'];
  protected exchange = 'learnsphere';
  protected exchangeType = 'topic';

  async publish(data: T['data'], options?: Options.Publish): Promise<void> {
    const channel = rabbitMQConnection.getChannel();
    await channel.assertExchange(this.exchange, this.exchangeType, {
      durable: true,
    });

    const message = JSON.stringify(data);

    channel.publish(this.exchange, this.topic, Buffer.from(message), options);

    logger.info(
      `Event published to exchange '${this.exchange}' with topic '${this.topic}': %o`,
      { data, options }
    );
  }
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

interface MessagesReadEvent {
  topic: 'messages.read';
  data: {
    conversationId: string;
    readByUserId: string;
    readAt: string;
  };
}

export class MessagesReadPublisher extends Publisher<MessagesReadEvent> {
  readonly topic: 'messages.read' = 'messages.read' as const;
}

interface GroupUpdatedEvent {
  topic: 'group.updated';
  data: {
    conversationId: string;
  };
}

export class GroupUpdatedPublisher extends Publisher<GroupUpdatedEvent> {
  readonly topic: 'group.updated' = 'group.updated' as const;
}

interface StudyRoomReminderRequestedEvent {
  topic: 'study.room.reminder.requested';
  data: {
    userId: string;
    roomId: string;
    roomTitle: string;
    startTime: string;
  };
}
export class StudyRoomReminderPublisher extends Publisher<StudyRoomReminderRequestedEvent> {
  readonly topic = 'study.room.reminder.requested' as const;
  protected exchange = 'delay.exchange';
}
