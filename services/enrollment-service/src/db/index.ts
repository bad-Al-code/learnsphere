import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { healthState } from '../config/health-state';
import logger from '../config/logger';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error(`DATABASE_URL environemnt variable is not set.`);
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
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
  logger: process.env.NODE_ENV === 'development',
});

export const checkDatabaseConnection = async () => {
  try {
    await db.query.enrollments.findFirst();
    logger.info(`Database connection verified successfully,`);
    healthState.set('db', true);
  } catch (error) {
    logger.info(`Failed to verify Database connection`);
    healthState.set('db', false, (error as Error).message);

    throw error;
  }
};
