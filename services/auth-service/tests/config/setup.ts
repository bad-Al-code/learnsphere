import { promisify } from 'node:util';
import { exec } from 'node:child_process';
import { afterAll, beforeAll } from 'vitest';

import { env } from '../../src/config/env';
import logger from '../../src/config/logger';
import { redisConnection } from '../../src/config/redis';
import { pool } from '../../src/db';
import { rabbitMQConnection } from '../../src/events/connection';

env.DATABASE_URL = `${env.DATABASE_URL}_test`;

const runMigrations = async () => {
  const execPromises = promisify(exec);
  logger.info(`\nMigrating test databaes: ${env.DATABASE_URL}`);

  try {
    await execPromises('pnpm db:migrate');
    logger.info(`Test Database migration successful`);
  } catch (error) {
    logger.error(`Test database migration failed: `, error);

    process.exit(1);
  }
};

beforeAll(async () => {
  await rabbitMQConnection.connect();
  await redisConnection.connect();
  await runMigrations();
});

afterAll(async () => {
  await pool.end();
  await redisConnection.disconnect();
  await rabbitMQConnection.close();
});
