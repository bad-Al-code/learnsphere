import { Server } from 'node:http';
import { WebSocket, WebSocketServer } from 'ws';
import jwt from 'jsonwebtoken';

import logger from '../config/logger';
import { env } from '../config/env';

const clients = new Map<string, WebSocket>();

export class WebSocketService {
  private wss: WebSocketServer;

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server });

    logger.info('WebSocketService initialized and attached to HTTP server.');
  }

  public start(): void {
    this.wss.on('connection', (ws: WebSocket, req) => {
      logger.info(`A new client is attempting to connect via WebSocket...`);

      const cookieHeader = req.headers.cookie || '';
      const cookies = Object.fromEntries(
        cookieHeader.split(';').map((c) => c.trim().split('='))
      );
      const token = cookies.token;

      if (!token) {
        logger.warn(`WebSocket connection rejected: No token provided.`);

        ws.close(1008, 'Authentication token not provided.');

        return;
      }

      try {
        const payload = jwt.verify(token, env.JWT_SECRET) as { id: string };
        const userId = payload.id;

        if (clients.has(userId)) {
          clients.get(userId)?.close(1008, 'New connection established.');
        }

        clients.set(userId, ws);

        logger.info(
          `WebSocket client connected and authenticated for user: ${userId}`
        );

        ws.on('close', () => {
          if (clients.get(userId) === ws) {
            clients.delete(userId);
            logger.info(`WebSocket client disconnected for user: ${userId}`);
          }
        });

        ws.on('message', (message) => {
          logger.debug(`Received message from user ${userId}: ${message}`);
        });
      } catch (_error) {
        logger.error('WebSocket connection rejected: Invalid token.');
        ws.close(1008, 'Invalid authentication token');
      }
    });

    logger.info('WebSocketService is listening for connections.');
  }

  /**
   * Sends a notification to a specific user if they are connected.
   * @param userId The ID of the user to send the notification to.
   * @param notification The notification object to send.
   */
  public static sendNotification(userId: string, notification: object): void {
    const client = clients.get(userId);
    if (client && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(notification));
      logger.info(`Sent real-time notification to user: ${userId}`);
    } else {
      logger.info(
        `User ${userId} is not connected. Notification stored in DB but not sent in real-time.`
      );
    }
  }
}
