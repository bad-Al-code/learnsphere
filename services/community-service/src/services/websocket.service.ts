import * as cookie from 'cookie';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { IncomingMessage, Server } from 'node:http';
import { WebSocket, WebSocketServer } from 'ws';

import { env } from '../config/env';
import logger from '../config/logger';
import { UserPayload } from '../middlewares/current-user';

export class WebSocketService {
  private wss: WebSocketServer;
  private clients: Map<string, WebSocket> = new Map();

  /**
   * Creates a new WebSocketService instance.
   * @param server - The HTTP server to attach the WebSocket server to.
   */
  constructor(server: Server) {
    this.wss = new WebSocketServer({ server });
    logger.info('WebSocketManager initialized.');
  }

  /**
   * Starts listening for new WebSocket connections.
   * Handles authentication, client registration,
   * incoming messages, disconnections, and errors.
   */
  public start(): void {
    this.wss.on('connection', (ws, req) => {
      try {
        const userId = this.authenticate(req);
        this.addClient(userId, ws);

        ws.on('message', (message: string) => {
          this.handleMessage(userId, message);
        });

        ws.on('close', () => {
          this.removeClient(userId);
        });

        ws.on('error', (error) => {
          logger.error(`WebSocket error for user ${userId}:`, { error });

          this.removeClient(userId);
        });
      } catch (error) {
        logger.warn('WebSocket connection rejected:', {
          message: (error as Error).message,
        });

        ws.close(1008, (error as Error).message);
      }
    });

    logger.info('WebSocketServer is listening for connections.');
  }

  /**
   * Authenticates an incoming WebSocket connection request.
   * @param req - The HTTP upgrade request containing cookies.
   * @returns The authenticated user's ID.
   * @throws If authentication fails due to missing/invalid token or cookie.
   */
  private authenticate(req: IncomingMessage): string {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      throw new Error('Authentication failed: No cookie header.');
    }

    const cookies = cookie.parse(cookieHeader);
    const rawToken = cookies.token;

    if (!rawToken) {
      throw new Error('Authentication failed: No session token provided.');
    }

    const unsignedToken = cookieParser.signedCookie(
      rawToken,
      env.COOKIE_PARSER_SECRET
    );
    if (!unsignedToken) {
      throw new Error('Authentication failed: Invalid cookie signature.');
    }

    try {
      const payload = jwt.verify(unsignedToken, env.JWT_SECRET) as UserPayload;
      return payload.id;
    } catch (err) {
      throw new Error('Authentication failed: Invalid token.');
    }
  }

  /**
   * Adds a client to the connected clients map.
   * If the user already has an active connection, the previous one is closed.
   * @param userId - The authenticated user's ID.
   * @param ws - The WebSocket instance associated with the user.
   */
  private addClient(userId: string, ws: WebSocket): void {
    if (this.clients.has(userId)) {
      this.clients
        .get(userId)
        ?.close(1001, 'New connection established from another location.');
    }

    this.clients.set(userId, ws);

    logger.info(
      `Client connected and authenticated for user: ${userId}. Total clients: ${this.clients.size}`
    );
  }

  /**
   * Removes a client from the connected clients map.
   * @param userId - The user's ID to remove.
   */
  private removeClient(userId: string): void {
    this.clients.delete(userId);

    logger.info(
      `Client disconnected for user: ${userId}. Total clients: ${this.clients.size}`
    );
  }

  /**
   * Handles an incoming message from a client.
   * Currently just echoes the message back to the same client.
   * @param userId - The ID of the user who sent the message.
   * @param message - The message content.
   */
  private handleMessage(userId: string, message: string): void {
    logger.info(`Received message from ${userId}: ${message}`);

    const ws = this.clients.get(userId);

    ws?.send(`Echo from ${userId}: ${message}`);
  }

  /**
   * Retrieves the WebSocket connection for a given user.
   * @param userId - The user ID whose WebSocket to fetch.
   * @returns The WebSocket instance if found, otherwise undefined.
   */
  public getClient(userId: string): WebSocket | undefined {
    return this.clients.get(userId);
  }
}
