import { createClient, RedisClientType } from 'redis';
import { healthState } from './health-state';
import logger from './logger';

class RedisConnection {
  private client!: RedisClientType;

  async connect(): Promise<void> {
    if (this.client?.isOpen) {
      return;
    }

    this.client = createClient({
      url: process.env.REDIS_URL,
    });

    this.client.on('error', (err) => {
      logger.error('Redis Client Error', { error: err });
    });

    this.client.on('ready', () => {
      logger.info('Redis connected successfully and ready to use.');
    });

    try {
      await this.client.connect();

      healthState.set('redis', true);
    } catch (err) {
      logger.error('Failed to connect to Redis', { error: err });

      healthState.set('redis', false, (err as Error).message);
      throw err;
    }
  }

  getClient(): RedisClientType {
    if (!this.client) {
      throw new Error('Redis client not available. Call connect() first.');
    }
    return this.client;
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      logger.info('Redis client disconnected.');
    }
  }
}

export const redisConnection = new RedisConnection();
