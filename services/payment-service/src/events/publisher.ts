import logger from '../config/logger';
import { rabbitMQConnection } from './connection';

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

interface PaymentSuccessfulEvent {
  topic: 'payment.successful';
  data: {
    paymentId: string;
    userId: string;
    courseId: string;
    amount: string;
    currency: string;
    completedAt: Date;
  };
}

export class PaymentSuccessfulPublisher extends Publisher<PaymentSuccessfulEvent> {
  readonly topic: 'payment.successful' = 'payment.successful' as const;
}
