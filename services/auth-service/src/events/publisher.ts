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

interface UserRegisteredEvent {
  topic: 'user.registered';
  data: {
    id: string;
    email: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
}

export class UserRegisteredPublisher extends Publisher<UserRegisteredEvent> {
  readonly topic: 'user.registered' = 'user.registered' as const;
}

interface UserVerificationRequiredEvent {
  topic: 'user.verification.required';
  data: {
    email: string;
    verificationCode: string;
    verificationToken: string;
  };
}

export class UserVerificationRequiredPublisher extends Publisher<UserVerificationRequiredEvent> {
  readonly topic: 'user.verification.required' =
    'user.verification.required' as const;
}

interface UserPasswordResetRequiredEvent {
  topic: 'user.password_reset.required';
  data: {
    email: string;
    resetCode: string;
    resetToken: string;
  };
}

export class UserPasswordResetRequiredPublisher extends Publisher<UserPasswordResetRequiredEvent> {
  readonly topic: 'user.password_reset.required' =
    'user.password_reset.required' as const;
}

interface UserPasswordChangedEvent {
  topic: 'user.password.changed';
  data: {
    userId: string;
    email: string;
  };
}

export class UserPasswordChangedPublisher extends Publisher<UserPasswordChangedEvent> {
  readonly topic: 'user.password.changed' = 'user.password.changed' as const;
}

interface UserVerifiedEvent {
  topic: 'user.verified';
  data: {
    userId: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
  };
}

export class UserVerifiedPublisher extends Publisher<UserVerifiedEvent> {
  readonly topic = 'user.verified' as const;
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

interface UserSessionCreatedEvent {
  topic: 'user.session.created';
  data: {
    userId: string;
    deviceType: string | null;
  };
}

export class UserSessionCreatedPublisher extends Publisher<UserSessionCreatedEvent> {
  readonly topic: 'user.session.created' = 'user.session.created' as const;
}
