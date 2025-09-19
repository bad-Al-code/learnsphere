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

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/api/ai/voice-tutor' });

    logger.info(`WebSocketService initialized on /api/ai/voice-tutor`);
  }

  public start() {
    this.wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
      try {
        const userId = this.authenticate(req);

        logger.info(
          `WebSocket client connected and authenticated for user: ${userId}`
        );

        ws.on('message', (message: Buffer) => {});
        ws.on('close', () => {
          logger.info(`WebSocket client disconnected for user: ${userId}`);
        });
      } catch (error) {
        const err = error as Error;
        logger.warn('WebSocket connection rejected: %o', {
          message: err.message,
          name: err.name,
          stack: err.stack,
        });

        ws.close(1008, err.message);
      }
    });
  }

  private authenticate(req: IncomingMessage): string {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader)
      throw new Error('Authentication failed: No cookie header.');

    const cookies = cookie.parse(cookieHeader);
    const rawToken = cookies.token;
    if (!rawToken) throw new Error('Authentication failed: No session token.');

    const unsignedToken = cookieParser.signedCookie(
      rawToken,
      env.COOKIE_PARSER_SECRET
    );
    if (!unsignedToken)
      throw new Error('Authentication failed: Invalid cookie signature.');

    const payload = jwt.verify(unsignedToken, env.JWT_SECRET) as UserPayload;

    return payload.id;
  }
}
