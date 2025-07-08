import { rabbitMQConnection } from './connection';

import logger from '../config/logger';

export abstract class Publisher<T extends { topic: string; data: object }> {
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
      `Event published to exchange '${this.exchange}' with topic '${this.topic}'`,
      data
    );
  }
}

interface UserRoleUpdatedEvent {
  topic: 'user.role.updated';
  data: {
    userId: string;
    newRole: 'student' | 'instructor' | 'admin';
  };
}

export class UserRoleUpdatedPublisher extends Publisher<UserRoleUpdatedEvent> {
  readonly topic = 'user.role.updated' as const;
}
