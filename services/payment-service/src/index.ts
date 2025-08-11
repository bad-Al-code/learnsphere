import 'dotenv/config';

import { app } from './app';
import { env } from './config/env';
import logger from './config/logger';
import { rabbitMQConnection } from './events/connection';

const startServer = async () => {
  try {
    await rabbitMQConnection.connect();

    app.listen(env.PORT, () => {
      logger.info(
        `Payment service listening on port ${env.PORT} in ${env.NODE_ENV} mode`
      );
    });

    const shutdown = async () => {
      await rabbitMQConnection.close();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    logger.error('Failed to start the server', { error });
    process.exit(1);
  }
};

startServer();
