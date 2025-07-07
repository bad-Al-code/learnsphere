import { promisify } from "node:util";
import { exec } from "node:child_process";
import { afterAll, beforeAll } from "vitest";

import logger from "../../config/logger";
import { env } from "../../config/env";
import { redisConnection } from "../../config/redis";
import { pool } from "../../db";
env.DATABASE_URL = `${env.DATABASE_URL}_test`;

const runMigrations = async () => {
  const execPromises = promisify(exec);
  logger.info(`\nMigrating test databaes: ${env.DATABASE_URL}`);

  try {
    await execPromises("pnpm db:migrate");
    logger.info(`Test Database migration successful`);
  } catch (error) {
    logger.error(`Test database migration failed: `, error);

    process.exit(1);
  }
};

beforeAll(async () => {
  await redisConnection.connect();
  await runMigrations();
});

afterAll(async () => {
  await pool.end();
  await redisConnection.disconnect();
});
