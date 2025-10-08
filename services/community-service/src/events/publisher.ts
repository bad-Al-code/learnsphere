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

interface UserInvitedToStudyRoomEvent {
  topic: 'user.invited.to.study.room';
  data: {
    inviterId: string;
    inviteeId: string;
    roomId: string;
    roomTitle: string;
  };
}

export class UserInvitedToStudyRoomPublisher extends Publisher<UserInvitedToStudyRoomEvent> {
  readonly topic = 'user.invited.to.study.room' as const;
}

interface EventUserRegisteredEvent {
  topic: 'event.user.registered';
  data: {
    eventId: string;
    userId: string;
    eventTitle: string;
    eventDate: string;
  };
}

export class EventUserRegisteredPublisher extends Publisher<EventUserRegisteredEvent> {
  readonly topic = 'event.user.registered' as const;
}

interface EventUserUnregisteredEvent {
  topic: 'event.user.unregistered';
  data: { eventId: string; userId: string; eventTitle: string };
}

export class EventUserUnregisteredPublisher extends Publisher<EventUserUnregisteredEvent> {
  readonly topic = 'event.user.unregistered' as const;
}

interface EventReminderRequestedEvent {
  topic: 'event.reminder.requested';
  data: {
    eventId: string;
    userId: string;
    eventTitle: string;
    eventDate: string;
  };
}

export class EventReminderPublisher extends Publisher<EventReminderRequestedEvent> {
  readonly topic = 'event.reminder.requested' as const;
  protected exchange = 'delay.exchange';
}

interface MentorApplicationSubmittedEvent {
  topic: 'mentor.application.submitted';
  data: {
    applicationId: string;
    userId: string;
    userName: string | null;
    expertise: string;
  };
}

export class MentorApplicationSubmittedPublisher extends Publisher<MentorApplicationSubmittedEvent> {
  readonly topic: 'mentor.application.submitted' =
    'mentor.application.submitted' as const;
}
