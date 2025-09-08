import { ConsumeMessage } from 'amqplib';
import logger from '../config/logger';
import { UserRepository } from '../db/repositories';
import { rabbitMQConnection } from './connection';

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

interface UserRegisteredEvent {
  topic: 'user.registered';
  data: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    avatarUrl?: string | null;
  };
}

export class UserRegisteredListener extends Listener<UserRegisteredEvent> {
  readonly topic = 'user.registered' as const;
  queueGroupName = 'community-service-user-registered';

  async onMessage(data: UserRegisteredEvent['data'], _msg: ConsumeMessage) {
    try {
      logger.info(`Syncing new user registration: ${data.id}`);

      await UserRepository.upsert({
        id: data.id,
        name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
        avatarUrl: data.avatarUrl,
      });
    } catch (error) {
      logger.error('Failed to sync registered user', { data, error });
    }
  }
}

interface UserProfileUpdatedEvent {
  topic: 'user.profile.updated';
  data: {
    userId: string;
    firstName?: string | null;
    lastName?: string | null;
    avatarUrls?: { small?: string };
  };
}

export class UserProfileUpdatedListener extends Listener<UserProfileUpdatedEvent> {
  readonly topic = 'user.profile.updated' as const;
  queueGroupName = 'community-service-user-updated';

  async onMessage(data: UserProfileUpdatedEvent['data'], _msg: ConsumeMessage) {
    try {
      logger.info(`Syncing profile update for user: ${data.userId}`);

      await UserRepository.upsert({
        id: data.userId,
        name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
        avatarUrl: data.avatarUrls?.small,
      });
    } catch (error) {
      logger.error('Failed to sync user profile update', { data, error });
    }
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

export class UserProfileSyncListener extends Listener<UserProfileSyncEvent> {
  readonly topic = 'user.profile.sync' as const;
  queueGroupName = 'community-service-user-sync-ondemand';

  async onMessage(data: UserProfileSyncEvent['data'], _msg: ConsumeMessage) {
    try {
      logger.info(`Syncing user profile on-demand: ${data.userId}`);

      await UserRepository.upsert({
        id: data.userId,
        name: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
        avatarUrl: data.avatarUrl,
      });
    } catch (error) {
      logger.error('Failed to sync user profile on-demand', { data, error });
    }
  }
}
