import 'dotenv/config';

import logger from './config/logger';
import { rabbitMQConnection } from './events/connection';
import { checkDatabaseConnection } from './db';

const initializedServices = async () => {
  try {
    await rabbitMQConnection.connect();
    await checkDatabaseConnection();

    logger.info(`Shared services initialized sucessfully.`);
  } catch (error) {
    logger.error('Failed to initialized shared services', { error });
    process.exit(1);
  }
};

const main = async (): Promise<void> => {
  await initializedServices();

  import('./api');
  import('./worker');
};

main();
