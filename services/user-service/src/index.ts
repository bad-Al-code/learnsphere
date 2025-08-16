import 'dotenv/config';

import { app } from './app';
import { env } from './config/env';
import logger from './config/logger';
import { checkDatabaseConnection } from './db';
import { rabbitMQConnection } from './events/connection';
import {
  UserAvatarProcessedListener,
  UserRegisteredListener,
  UserSessionCreatedListener,
} from './events/listener';

const startServer = async () => {
  try {
    await rabbitMQConnection.connect();
    await checkDatabaseConnection();

    new UserRegisteredListener().listen();
    new UserAvatarProcessedListener().listen();
    new UserSessionCreatedListener().listen();

    const PORT = env.PORT || 8001;
    app.listen(PORT, () => {
      logger.info(
        `User service listening on port ${PORT} in ${env.NODE_ENV} mode`
      );
    });

    process.on('SIGINT', async () => {
      await rabbitMQConnection.close();
      process.exit(0);
    });
    process.on('SIGTERM', async () => {
      await rabbitMQConnection.close();
      process.exit(0);
    });
  } catch (error) {
    logger.error(`Failed to start the server `, { error });
    process.exit(1);
  }
};

startServer();
