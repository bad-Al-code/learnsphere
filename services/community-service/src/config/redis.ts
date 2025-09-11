import { createClient, RedisClientType } from 'redis';

import logger from './logger';
import { healthState } from './health-state';

class RedisConnection {
  private client!: RedisClientType;
  private publisher!: RedisClientType;
  private subscriber!: RedisClientType;

  async connect(): Promise<void> {
    if (this.client?.isOpen) {
      return;
    }

    const url = process.env.REDIS_URL;
    if (!url) throw new Error('REDIS_URL is not defined');

    this.client = createClient({ url });
    this.publisher = this.client.duplicate();
    this.subscriber = this.client.duplicate();

    this.client.on('error', (err) => {
      logger.error('Redis Client Error', err);
      healthState.set('redis', false, err.message);
    });

    this.client.on('ready', () => {
      healthState.set('redis', true);
      logger.info('Redis connected successfully and ready to use.');
    });

    await Promise.all([
      this.client.connect(),
      this.publisher.connect(),
      this.subscriber.connect(),
    ]);

    logger.info(
      'Redis connected successfully (client, publisher, subscriber).'
    );
  }

  getClient(): RedisClientType {
    if (!this.client) throw new Error('Redis client not available.');

    return this.client;
  }

  getPublisher(): RedisClientType {
    if (!this.publisher) throw new Error('Redis publisher not available.');

    return this.publisher;
  }

  getSubscriber(): RedisClientType {
    if (!this.subscriber) throw new Error('Redis subscriber not available.');

    return this.subscriber;
  }

  async disconnect(): Promise<void> {
    await Promise.all([
      this.client?.quit(),
      this.publisher?.quit(),
      this.subscriber?.quit(),
    ]);
  }
}

export const redisConnection = new RedisConnection();
