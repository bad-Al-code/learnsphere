import http from 'http';
import { WebSocketServer } from 'ws';
import { app } from './app';
import { env } from './config/env';
import logger from './config/logger';

const startServer = async () => {
  try {
    const server = http.createServer(app);
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws) => {
      logger.info('New client connected via WebSocket');

      ws.on('message', (message) => {
        logger.info(`Received message: ${message}`);
        ws.send(`Echo: ${message}`);
      });

      ws.on('close', () => {
        logger.info('Client disconnected');
      });
    });

    server.listen(env.PORT, () => {
      logger.info(
        `Community service (HTTP & WS) listening on port ${env.PORT} in ${env.NODE_ENV} mode`
      );
    });

    const shutdown = async () => {
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
