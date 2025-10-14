import { rabbitMQConnection } from './connection';

import { Options } from 'amqplib';
import logger from '../config/logger';

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

interface WaitlistNurtureWeek2Event {
  topic: 'waitlist.nurture.week2';
  data: {
    email: string;
    joinedAt: Date;
  };
}

export class WaitlistNurtureWeek2Publisher extends Publisher<WaitlistNurtureWeek2Event> {
  readonly topic = 'waitlist.nurture.week2' as const;
  protected exchange = 'delay.exchange';
}
