import { createServer } from 'node:http';
import { app } from './app';
import { env } from './config/env';
import logger from './config/logger';
import { redisConnection } from './config/redis';
import { checkDatabaseConnection } from './db';
import { rabbitMQConnection } from './events/connection';
import { WebSocketService } from './services/websocket.service';

const startServer = async () => {
  try {
    await rabbitMQConnection.connect();
    await checkDatabaseConnection();
    await redisConnection.connect();

    const server = createServer(app);

    const webSocketService = new WebSocketService(server);
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
