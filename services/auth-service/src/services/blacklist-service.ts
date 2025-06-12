import logger from "../config/logger";
import { redisConnection } from "../config/redis";

export class BlacklistService {
  public static async addToBlacklist(jti: string, tokenExp: number) {
    const redisClient = redisConnection.getClient();
    const key = `blacklist:${jti}`;

    const nowInSeconds = Math.floor(Date.now() / 1000);
    const ttl = tokenExp - nowInSeconds;

    if (ttl > 0) {
      try {
        await redisClient.set(key, "blacklisted", { EX: ttl });

        logger.info(
          `Token JTI ${jti} added to blacklist with ttl of ${ttl} seconds`
        );
      } catch (error) {
        logger.error(`Failed to add token to redis blacklist`, { jti, error });
      }
    }
  }

  public static async isBlacklisted(jti: string): Promise<boolean> {
    const redisClient = redisConnection.getClient();
    const key = `blacklist:${jti}`;

    const result = redisClient.get(key);

    return result !== null;
  }
}
