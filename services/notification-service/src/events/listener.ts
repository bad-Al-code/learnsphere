import { ConsumeMessage } from 'amqplib';

import logger from '../config/logger';
import { rabbitMQConnection } from './connection';
import { EmailService } from '../services/email-service';
import { NotificationService } from '../services/notification.service';

interface Event {
  topic: string;
  data: object;
}

export abstract class Listener<T extends Event> {
  abstract topic: T['topic'];
  abstract queueGroupName: string;
  abstract onMessage(data: T['data'], msg: ConsumeMessage): void;

  protected exchange = 'learnsphere';
  protected exchangeType = 'topic';

  listen(): void {
    const channel = rabbitMQConnection.getChannel();

    const setup = async () => {
      await channel.assertExchange(this.exchange, this.exchangeType, {
        durable: true,
      });
      const q = await channel.assertQueue(this.queueGroupName, {
        durable: true,
      });
      await channel.bindQueue(q.queue, this.exchange, this.topic);

      logger.info(
        `Waiting for messages in queue [${this.queueGroupName}] on topic [${this.topic}]`
      );

      channel.consume(q.queue, (msg: ConsumeMessage | null) => {
        if (msg) {
          if (msg.fields.routingKey === this.topic) {
            logger.debug(`Message received from topic [${this.topic}]`);
            const parsedData = JSON.parse(msg.content.toString());
            this.onMessage(parsedData, msg);
          } else {
            logger.debug(
              `Message with topic [${msg.fields.routingKey}] ignored by listener for [${this.topic}]`
            );
          }
          channel.ack(msg);
        }
      });
    };

    setup().catch((error) => {
      logger.error(`Error setting up listener`, {
        queue: this.queueGroupName,
        topic: this.topic,
        error,
      });
    });
  }
}

interface UserVerificationRequiredEvent {
  topic: 'user.verification.required';
  data: {
    email: string;
    verificationToken: string;
  };
}

export class UserVerificationRequiredListener extends Listener<UserVerificationRequiredEvent> {
  readonly topic: 'user.verification.required' =
    'user.verification.required' as const;
  queueGroupName = 'notification-service-verification';
  private emailService: EmailService;

  constructor(emailService: EmailService) {
    super();
    this.emailService = emailService;
  }

  async onMessage(
    data: { email: string; verificationToken: string },
    _msg: ConsumeMessage
  ): Promise<void> {
    logger.info(`Verification event received for: ${data.email}`);

    await this.emailService.sendVerificationEmail(data);
  }
}

interface UserPasswordResetRequiredEvent {
  topic: 'user.password_reset.required';
  data: {
    email: string;
    resetToken: string;
  };
}

export class UserPasswordResetRequiredListener extends Listener<UserPasswordResetRequiredEvent> {
  readonly topic: 'user.password_reset.required' =
    'user.password_reset.required' as const;
  queueGroupName: string = 'notification-service-password-reset';
  private emailService: EmailService;

  constructor(emailService: EmailService) {
    super();

    this.emailService = emailService;
  }

  async onMessage(
    data: { email: string; resetToken: string },
    _msg: ConsumeMessage
  ): Promise<void> {
    logger.info(`Password reset event received for: ${data.email}`);

    await this.emailService.sendPasswordResetEmail(data);
  }
}

interface UserRegisteredEvent extends Event {
  topic: 'user.registered';
  data: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
}

export class UserRegisteredWelcomeListener extends Listener<UserRegisteredEvent> {
  readonly topic = 'user.registered' as const;
  queueGroupName = 'notification-service-welcome';
  private emailService: EmailService;

  constructor(emailService: EmailService) {
    super();
    this.emailService = emailService;
  }

  async onMessage(
    data: UserRegisteredEvent['data'],
    _msg: ConsumeMessage
  ): Promise<void> {
    logger.info(`Welcome email event received for: ${data.email}`);
    await this.emailService.sendWelcomeEmail({
      email: data.email,
      firstName: data.firstName,
    });
  }
}

interface UserPasswordChangedEvent extends Event {
  topic: 'user.password.changed';
  data: {
    userId: string;
    email: string;
  };
}

export class UserPasswordChangedListener extends Listener<UserPasswordChangedEvent> {
  readonly topic = 'user.password.changed' as const;
  queueGroupName = 'notification-service-password-change';
  private emailService: EmailService;

  constructor(emailService: EmailService) {
    super();
    this.emailService = emailService;
  }

  async onMessage(
    data: UserPasswordChangedEvent['data'],
    _msg: ConsumeMessage
  ): Promise<void> {
    logger.info(`Password change notice event received for: ${data.email}`);

    await Promise.all([
      this.emailService.sendPasswordChangeNotice({ email: data.email }),

      NotificationService.createNotification({
        recipientId: data.userId,
        type: 'SECURITY_ALERT',
        content:
          'Your password was recently changed. If this was not you, please secure your accounr.',
        linkUrl: '/settings/security', // TODO: link to security setting page on the frontend
      }),
    ]).catch((error) => {
      logger.error('Error processing user.password.changed event', {
        userId: data.userId,
        error,
      });
    });
  }
}

interface UserVerifiedEvent extends Event {
  topic: 'user.verified';
  data: {
    userId: string;
    email: string;
  };
}

export class UserVerifiedListener extends Listener<UserVerifiedEvent> {
  readonly topic = 'user.verified' as const;
  queueGroupName = 'notification-service-welcome';
  private emailService: EmailService;

  constructor(emailService: EmailService) {
    super();
    this.emailService = emailService;
  }

  async onMessage(
    data: UserVerifiedEvent['data'],
    _msg: ConsumeMessage
  ): Promise<void> {
    logger.info(
      `User verified event received for: ${data.email}. Sending welcome email.`
    );

    await Promise.all([
      this.emailService.sendWelcomeEmail({
        email: data.email,
      }),

      NotificationService.createNotification({
        recipientId: data.userId,
        type: 'WELCOME',
        content:
          'Welcome to LearnSphere! Your account is now verified and ready to go.',
        linkUrl: '/dashboard',
      }),
    ]).catch((error) => {
      logger.error(`Error processing user.verified event`, {
        userId: data.userId,
        error,
      });
    });
  }
}
