import { ConsumeMessage } from 'amqplib';
import logger from '../config/logger';
import { SessionRepository } from '../db/session.repository';
import { UserRepository } from '../db/user.repository';
import { AuthService } from '../services/auth.service';
import { rabbitMQConnection } from './connection';
import { UserRoleUpdatedPublisher } from './publisher';

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

interface UserRoleUpdatedEvent extends Event {
  topic: 'user.role.updated';
  data: {
    userId: string;
    newRole: 'student' | 'instructor' | 'admin';
  };
}

export class UserRoleUpdatedListener extends Listener<UserRoleUpdatedEvent> {
  readonly topic = 'user.role.updated' as const;
  queueGroupName = 'auth-service-role-update';

  async onMessage(
    data: UserRoleUpdatedEvent['data'],
    _msg: ConsumeMessage
  ): Promise<void> {
    logger.info(`User role update event received for user: ${data.userId}`);

    try {
      const user = await UserRepository.findById(data.userId);
      if (!user) {
        logger.warn(`Role update event for non-existent user: ${data.userId}`);
        return;
      }

      await AuthService.updateUserRole(data.userId, data.newRole);
      logger.info(
        `Successfully updated role for user ${data.userId} to ${data.newRole}`
      );

      const publisher = new UserRoleUpdatedPublisher();
      await publisher.publish({
        userId: data.userId,
        newRole: data.newRole,
        userEmail: user.email,
      });

      logger.info(
        `Invalidating all session for user ${data.userId} to force role refresh.`
      );

      await SessionRepository.deleteAllForUser(data.userId);
    } catch (error) {
      logger.error('Failed to process user.role.updated event', {
        data,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
