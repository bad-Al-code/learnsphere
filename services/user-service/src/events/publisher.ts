import { rabbitMQConnection } from './connection';

import logger from '../config/logger';

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

interface UserRoleUpdatedEvent {
  topic: 'user.role.updated';
  data: {
    userId: string;
    newRole: 'student' | 'instructor' | 'admin';
    userEmail: string;
  };
}

export class UserRoleUpdatedPublisher extends Publisher<UserRoleUpdatedEvent> {
  readonly topic = 'user.role.updated' as const;
}

interface InstructorApplicationSubmittedEvent {
  topic: 'instructor.application.submitted';
  data: {
    userId: string;
    userName: string;
    userEmail: string;
    applicationData: {
      expertise: string;
    };
    submittedAt: string;
  };
}

export class InstructorApplicationSubmittedPublisher extends Publisher<InstructorApplicationSubmittedEvent> {
  readonly topic: 'instructor.application.submitted' =
    'instructor.application.submitted' as const;
}

interface InstructorApplicationDeclinedEvent {
  topic: 'instructor.application.declined';
  data: {
    userId: string;
    userName: string;
    userEmail: string;
    reason?: string;
  };
}

export class InstructorApplicationDeclinedPublisher extends Publisher<InstructorApplicationDeclinedEvent> {
  readonly topic = 'instructor.application.declined' as const;
}

interface InstructorApplicationApprovedEvent {
  topic: 'instructor.application.approved';
  data: {
    userId: string;
    userEmail: string;
    userName: string;
  };
}

export class InstructorApplicationApprovedPublisher extends Publisher<InstructorApplicationApprovedEvent> {
  readonly topic = 'instructor.application.approved' as const;
}
