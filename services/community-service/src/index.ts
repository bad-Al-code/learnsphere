import { createServer } from 'node:http';
import { app } from './app';
import { env } from './config/env';
import logger from './config/logger';
import { redisConnection } from './config/redis';
import { checkDatabaseConnection } from './db';
import { rabbitMQConnection } from './events/connection';

import {
  ChatMediaProcessedListener,
  UserProfileUpdatedListener,
  UserRegisteredListener,
} from './events/listener';
import { WebSocketService } from './services/websocket.service';

export let webSocketService: WebSocketService;

const startServer = async () => {
  try {
    await rabbitMQConnection.connect();
    await checkDatabaseConnection();
    await redisConnection.connect();

    new UserRegisteredListener().listen();
    new UserProfileUpdatedListener().listen();
    new ChatMediaProcessedListener().listen();

    const server = createServer(app);

    webSocketService = new WebSocketService(server);
    webSocketService.start();

    server.listen(env.PORT, () => {
      logger.info(
        `Community service (HTTP & WS) listening on port ${env.PORT} in ${env.NODE_ENV} mode`
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
    logger.error('Failed to start the community service', { error });
    process.exit(1);
  }
};

startServer();
