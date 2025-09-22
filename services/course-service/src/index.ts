import 'dotenv/config';

import { app } from './app';
import { env } from './config/env';
import logger from './config/logger';
import { redisConnection } from './config/redis';
import { checkDatabaseConnection } from './db';
import { rabbitMQConnection } from './events/connection';
import {
  CourseThumbnailProcessedListener,
  VideoProcessedListener,
} from './events/listener';

const startServer = async () => {
  try {
    await rabbitMQConnection.connect();
    await redisConnection.connect();
    await checkDatabaseConnection();

    new VideoProcessedListener().listen();
    new CourseThumbnailProcessedListener().listen();

    const PORT = env.PORT || 8001;

    app.listen(PORT, () => {
      logger.info(
        `Course service listening on port ${PORT} in ${env.NODE_ENV} mode`
      );
    });

    const shutdown = async () => {
      await rabbitMQConnection.close();
      await redisConnection.disconnect();
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    const err = error as Error;
    logger.error('Failed to start the server: %o', { errMessage: err.message });
    process.exit(1);
  }
};

startServer();
