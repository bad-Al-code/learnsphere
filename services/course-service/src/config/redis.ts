import { createClient, RedisClientType } from "redis";
import logger from "./logger";
import { healthState } from "./health-state";

class RedisConnection {
  private client!: RedisClientType;

  async connect(): Promise<void> {
    if (this.client?.isOpen) {
      return;
    }

    this.client = createClient({
      url: process.env.REDIS_URL,
    });

    this.client.on("error", (err) => {
      logger.error("Redis Client Error", { error: err });
    });

    this.client.on("ready", () => {
      healthState.set("redis", true);
      logger.info("Redis connected successfully and ready to use.");
    });

    try {
      await this.client.connect();
    } catch (err) {
      logger.error("Failed to connect to Redis", { error: err });

      healthState.set("redis", false);
      throw err;
    }
  }

  getClient(): RedisClientType {
    if (!this.client) {
      throw new Error("Redis client not available. Call connect() first.");
    }
    return this.client;
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      logger.info("Redis client disconnected.");
    }
  }
}

export const redisConnection = new RedisConnection();
