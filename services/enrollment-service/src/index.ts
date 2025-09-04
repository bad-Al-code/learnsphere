import 'dotenv/config';

import { app } from './app';
import logger from './config/logger';
import { redisConnection } from './config/redis';
import { checkDatabaseConnection } from './db';
import { rabbitMQConnection } from './events/connection';
import {
  CourseSyncCreatedListener,
  CourseSyncDeletedListener,
  CourseSyncUpdatedListener,
  DiscussionPostCreatedListener,
  GradeSyncListener,
  PaymentSuccessListener,
  ReportGenerationFailedListener,
  ReportGenerationSuccessListener,
  ResourceDownloadedListener,
  UserSessionCreatedListener,
} from './events/listener';

const startServer = async () => {
  try {
    await rabbitMQConnection.connect();
    await redisConnection.connect();
    await checkDatabaseConnection();

    new CourseSyncCreatedListener().listen();
    new CourseSyncUpdatedListener().listen();
    new CourseSyncDeletedListener().listen();
    new DiscussionPostCreatedListener().listen();
    new UserSessionCreatedListener().listen();
    new GradeSyncListener().listen();
    new PaymentSuccessListener().listen();
    new ResourceDownloadedListener().listen();
    new ReportGenerationSuccessListener().listen();
    new ReportGenerationFailedListener().listen();

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      logger.info(
        `Enrollment service listening on port ${PORT} in ${process.env.NODE_ENV} mode`
      );
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
