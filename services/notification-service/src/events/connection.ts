import amqp, { Channel, ChannelModel } from 'amqplib';
import { env } from '../config/env';
import { healthState } from '../config/health-state';
import logger from '../config/logger';

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 5000;
const NOTIFICATION_PROCESSING_EXCHANGE = 'notification-processing.exchange';
const DELAY_EXCHANGE = 'delay.exchange';
// const AI_FEEDBACK_DELAY_QUEUE = 'ai-feedback.delay.queue';
// const AI_FEEDBACK_PROCESSING_QUEUE = 'ai-feedback.processing.queue';
// const AI_FEEDBACK_ROUTING_KEY = 'ai.feedback.ready';

class RabbitMQConnection {
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;

  public async connect(): Promise<void> {
    if (this.connection) {
      logger.info('RabbitMQ already connected.');
      return;
    }

    const rabbitUrl = env.RABBITMQ_URL;
    if (!rabbitUrl) {
      throw new Error('Missing RABBITMQ_URL in environment.');
    }

    let retries = 0;
    while (retries < MAX_RETRIES) {
      try {
        logger.info('Connecting to RabbitMQ...');

        const connection = await amqp.connect(rabbitUrl);
        const channel = await connection.createChannel();

        this.connection = connection;
        this.channel = channel;

        logger.info('RabbitMQ connected successfully.');
        healthState.set('rabbitmq', true);

        this.channel.on('close', () => {
          logger.warn('RabbitMQ channel closed.');
          this.channel = null;
        });

        this.channel.on('error', (err) => {
          logger.error('RabbitMQ channel error', { error: err.message });
        });

        await this.channel.assertExchange(
          NOTIFICATION_PROCESSING_EXCHANGE,
          'direct',
          { durable: true }
        );
        await this.channel.assertExchange(DELAY_EXCHANGE, 'direct', {
          durable: true,
        });
        // await this.channel.assertQueue(AI_FEEDBACK_DELAY_QUEUE, {
        //   durable: true,
        //   deadLetterExchange: NOTIFICATION_PROCESSING_EXCHANGE,
        //   deadLetterRoutingKey: AI_FEEDBACK_ROUTING_KEY,
        // });

        // await this.channel.bindQueue(
        //   AI_FEEDBACK_DELAY_QUEUE,
        //   DELAY_EXCHANGE,
        //   AI_FEEDBACK_ROUTING_KEY
        // );
        // await this.channel.assertQueue(AI_FEEDBACK_PROCESSING_QUEUE, {
        //   durable: true,
        // });
        // await this.channel.bindQueue(
        //   AI_FEEDBACK_PROCESSING_QUEUE,
        //   NOTIFICATION_PROCESSING_EXCHANGE,
        //   AI_FEEDBACK_ROUTING_KEY
        // );

        // logger.info(
        //   'RabbitMQ DLX and delay queues for AI feedback configured successfully.'
        // );

      logger.info('RabbitMQ exchanges for delayed messaging configured successfully.');

        return;
      } catch (err) {
        retries++;
        healthState.set('rabbitmq', false);

        logger.error(
          `Failed to connect to RabbitMQ. Retrying in ${
            RETRY_DELAY_MS / 1000
          }s...`,
          {
            error: (err as Error).message,
          }
        );

        if (retries >= MAX_RETRIES) {
          logger.error(`Max retries reached. Could not connect to RabbitMQ`);
          throw err;
        }

        await new Promise((res) => setTimeout(res, RETRY_DELAY_MS));
      }
    }
  }

  public getChannel(): Channel {
    if (!this.channel) {
      throw new Error('RabbitMQ channel not available. Call connect() first.');
    }
    return this.channel;
  }

  public async close(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
        logger.info('RabbitMQ channel closed.');
      }

      if (this.connection) {
        const conn = this.connection;
        await conn.close();
        logger.info('RabbitMQ connection closed.');
      }
    } catch (err) {
      logger.error('Error closing RabbitMQ', {
        error: (err as Error).message,
      });
    } finally {
      this.channel = null;
      this.connection = null;
    }
  }
}

export const rabbitMQConnection = new RabbitMQConnection();
