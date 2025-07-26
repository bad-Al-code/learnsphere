import logger from '../config/logger';
import { redisConnection } from '../config/redis';

const CACHE_TTL_SECONDS = 10 * 60;

export class CacheService {
  private static get client() {
    return redisConnection.getClient();
  }

  public static async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);
      if (data) {
        logger.debug(`Cache HIT for key: ${key}`);

        return JSON.parse(data) as T;
      }

      logger.debug(`CAche MISS for key: ${key}`);
      return null;
    } catch (error) {
      logger.error(`Error getting data from Redis cache`, { key, error });

      return null;
    }
  }

  public static async set(key: string, value: unknown): Promise<void> {
    try {
      const stringValue = JSON.stringify(value);
      await this.client.set(key, stringValue, { EX: CACHE_TTL_SECONDS });

      logger.debug(`Cache SET for key: ${key}`);
    } catch (error) {
      logger.error(`Error setting data in Redis cache`, { key, error });
    }
  }

  public static async del(key: string): Promise<void> {
    try {
      await this.client.del(key);

      logger.info(`Cache DELETED for key: ${key}`);
    } catch (error) {
      logger.error(`Errpr deleting data from Redis cache`, { key, error });
    }
  }
}
