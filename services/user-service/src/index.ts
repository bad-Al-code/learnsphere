import 'dotenv/config';

import { createServer } from 'node:http';
import { app } from './app';
import { env } from './config/env';
import logger from './config/logger';
import { checkDatabaseConnection } from './db';
import { rabbitMQConnection } from './events/connection';
import {
  CourseContentUpdatedListener,
  UserAvatarProcessedListener,
  UserEnrolledListener,
  UserRegisteredListener,
  UserSessionCreatedListener,
} from './events/listener';
import { WebSocketService } from './services/websocket.service';

const startServer = async () => {
  try {
    await rabbitMQConnection.connect();
    await checkDatabaseConnection();

    new UserRegisteredListener().listen();
    new UserAvatarProcessedListener().listen();
    new UserSessionCreatedListener().listen();
    new CourseContentUpdatedListener().listen();
    new UserEnrolledListener().listen();

    const PORT = env.PORT || 8002;
    const server = createServer(app);
    const webSocketService = new WebSocketService(server);
    webSocketService.start();

    server.listen(PORT, () => {
      logger.info(
        `User service listening on port ${PORT} in ${env.NODE_ENV} mode`
      );
    });

    process.on('SIGINT', async () => {
      await rabbitMQConnection.close();
      process.exit(1);
    });
    process.on('SIGTERM', async () => {
      await rabbitMQConnection.close();
      process.exit(1);
    });
  } catch (error) {
    logger.error(`Failed to start the server `, { error });
    process.exit(2);
  }
};

startServer();
