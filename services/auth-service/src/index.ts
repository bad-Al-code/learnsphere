import 'dotenv/config';

import { app } from './app';
import logger from './config/logger';
import { rabbitMQConnection } from './events/connection';
import { redisConnection } from './config/redis';
import { checkDatabaseConnection } from './db';
import { env } from './config/env';

const startServer = async () => {
  try {
    await rabbitMQConnection.connect();
    await redisConnection.connect();
    await checkDatabaseConnection();

    const PORT = env.PORT;
    const NODE_ENV = env.NODE_ENV;
    app.listen(PORT, () => {
      logger.info(`Auth service listening on port ${PORT} in ${NODE_ENV} mode`);
    });

    const shutdown = async () => {
      await rabbitMQConnection.close();
      await redisConnection.disconnect();
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
