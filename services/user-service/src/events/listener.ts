import { ConsumeMessage } from 'amqplib';
import logger from '../config/logger';
import { ProfileService } from '../services/profile.service';
import { rabbitMQConnection } from './connection';

interface Event {
  topic: string;
  data: unknown;
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
          logger.debug(`Message received from topic [${this.topic}]`);
          const parsedData = JSON.parse(msg.content.toString());
          this.onMessage(parsedData, msg);

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

export class UserRegisteredListener extends Listener<UserRegisteredEvent> {
  readonly topic: 'user.registered' = 'user.registered' as const;
  queueGroupName: string = 'user-service';

  async onMessage(
    data: UserRegisteredEvent['data'],
    _msg: ConsumeMessage
  ): Promise<void> {
    logger.info(`Event data received for topic [${this.topic}]: %o`, data);

    try {
      const avatarJson = data.avatarUrl
        ? {
            small: data.avatarUrl,
            medium: data.avatarUrl,
            large: data.avatarUrl,
          }
        : undefined;

      await ProfileService.createProfile({
        userId: data.id,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        avatarUrls: avatarJson,
      });
    } catch (error) {
      logger.error(`Failed to process user.registerd event`, { data, error });
    }
  }
}

interface UserAvatarProcessedEvent extends Event {
  topic: 'user.avatar.processed';
  data: {
    userId: string;
    avatarUrls: {
      small?: string;
      medium?: string;
      large?: string;
    };
  };
}

export class UserAvatarProcessedListener extends Listener<UserAvatarProcessedEvent> {
  readonly topic: 'user.avatar.processed' = 'user.avatar.processed' as const;
  queueGroupName: string = 'user-service-avatar';

  async onMessage(
    data: {
      userId: string;
      avatarUrls: { small?: string; medium?: string; large?: string };
    },
    _msg: ConsumeMessage
  ): Promise<void> {
    logger.info(`Avatar processed event received for user: ${data.userId}`);

    try {
      await ProfileService.updateProfile(data.userId, {
        avatarUrls: data.avatarUrls,
      });

      logger.info(`Successfully updated avatar for user: ${data.userId}`);
    } catch (error) {
      logger.error(`Failed to process user.avatar.processed event`, {
        userId: data.userId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}

interface UserSessionCreatedEvent extends Event {
  topic: 'user.session.created';
  data: {
    userId: string;
    deviceType: string | null;
  };
}

export class UserSessionCreatedListener extends Listener<UserSessionCreatedEvent> {
  readonly topic: 'user.session.created' = 'user.session.created' as const;
  queueGroupName: string = 'user-service-session';

  async onMessage(
    data: UserSessionCreatedEvent['data'],
    _msg: ConsumeMessage
  ): Promise<void> {
    logger.info(`Session event received for user: ${data.userId}`);
    try {
      await ProfileService.updateProfile(data.userId, {
        lastKnownDevice: data.deviceType,
      });
      logger.info(
        `Successfully updated last known device for user: ${data.userId}`
      );
    } catch (error) {
      logger.error('Failed to process user.session.created event', {
        userId: data.userId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
