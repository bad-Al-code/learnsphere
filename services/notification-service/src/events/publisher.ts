import { Options } from 'amqplib';

import logger from '../config/logger';
import { rabbitMQConnection } from './connection';

export abstract class Publisher<T extends { topic: string; data: unknown }> {
  abstract topic: T['topic'];
  protected exchange = 'learnsphere';
  protected exchangeType = 'topic';

  /**
   * Publish an event to the exchange
   * @param data - The event payload
   * @param options - Optional RabbitMQ publish options, e.g., { expiration: 60000 }
   */
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

interface AIFeedbackDeliveredEvent {
  topic: 'notification.feedback.delivered';
  data: {
    submissionId: string;
  };
}

export class AIFeedbackDeliveredPublisher extends Publisher<AIFeedbackDeliveredEvent> {
  readonly topic = 'notification.feedback.delivered' as const;
}
