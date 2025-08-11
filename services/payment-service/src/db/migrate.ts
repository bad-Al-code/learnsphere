import 'dotenv/config';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import logger from '../config/logger';
import { db, pool } from './index';

const runMigrations = async () => {
  try {
    await migrate(db, { migrationsFolder: 'src/db/migrations' });

    logger.info(`Migartion applied successfully!`);
  } catch (error) {
    const err = error as Error;
    logger.error(`Error applying migrations: `, {
      message: err.message,
      name: err.name,
      stack: err.stack,
    });

    process.exit(1);
  } finally {
    await pool.end();
  }
};

runMigrations();
