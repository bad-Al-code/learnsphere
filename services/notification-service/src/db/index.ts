import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { env } from '../config/env';
import logger from '../config/logger';
import * as schema from './schema';

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

pool.on('connect', () => {
  logger.info('Database for notification-service connected successfully');
});

export const db = drizzle(pool, {
  schema,
  logger: env.NODE_ENV === 'development',
});
