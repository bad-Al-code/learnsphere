import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { env } from '../config/env';
import { healthState } from '../config/health-state';
import logger from '../config/logger';
import * as schema from './schema';

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

pool.on('connect', () => {
  logger.info(`Database connected successfully`);
  healthState.set('db', true);
});

pool.on('error', (err) => {
  logger.error('Database connection error', { error: err.stack });
  healthState.set('db', false);
  // process.exit(1);
});

export const db = drizzle(pool, {
  schema,
  logger: env.NODE_ENV === 'development',
});

export const checkDatabaseConnection = async () => {
  try {
    await db.query.courses.findFirst();
    logger.info(`Database connection verified successfully,`);
    healthState.set('db', true);
  } catch (error) {
    logger.info(`Failed to verify Database connection`);
    healthState.set('db', false);

    throw error;
  }
};
