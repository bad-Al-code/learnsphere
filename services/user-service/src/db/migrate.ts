import 'dotenv/config';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import logger from '../config/logger';
import { db, pool } from './index';

const runMigrations = async () => {
  try {
    await migrate(db, { migrationsFolder: 'src/db/migrations' });

    logger.info(`Migartion applied successfully!`);
  } catch (error) {
    logger.error(`Error applying migrations: %o`, { error });

    process.exit(1);
  } finally {
    await pool.end();
  }
};

runMigrations();
