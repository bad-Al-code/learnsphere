import 'dotenv/config';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import logger from '../config/logger';
import { db, pool } from './index';

const runMigrations = async () => {
  try {
    await migrate(db, { migrationsFolder: 'src/db/migrations' });

    logger.info(`Migartion applied successfully!`);
  } catch (err) {
    let error = err as Error;
    logger.error('Error applying migrations: %o', {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    process.exit(1);
  } finally {
    await pool.end();
  }
};

runMigrations();
