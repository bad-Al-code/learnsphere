import 'dotenv/config';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

import logger from '../config/logger';
import { db, pool } from './index';

const runMigrations = async () => {
  logger.info('Running database migratino');

  try {
    await migrate(db, { migrationsFolder: 'src/db/migrations' });

    logger.info(`Migrations applied successfully!`);
  } catch (error) {
    logger.error(`Error applying migrations: ${error}`);

    process.exit(1);
  } finally {
    await pool.end();
  }
};

runMigrations();
