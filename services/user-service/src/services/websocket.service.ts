import * as cookie from 'cookie';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { IncomingMessage, Server } from 'node:http';
import { WebSocket, WebSocketServer } from 'ws';

import { parse } from 'node:url';
import { env } from '../config/env';
import logger from '../config/logger';
import { VoiceTutorSession } from '../features/ai/voice-tutor/live-session';
import { UserPayload } from '../middlewares/current-user';

export class WebSocketService {
  private wss: WebSocketServer;
  private activeSessions: Map<string, VoiceTutorSession> = new Map();

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/api/ai/voice-tutor' });

    logger.info(`WebSocketService initialized on /api/ai/voice-tutor`);
  }

  /**
   * Starts the WebSocket server and begins listening for connections.
   * It sets up handlers for new connections, messages, and disconnections.
   */
  public start() {
    this.wss.on('connection', async (ws: WebSocket, req: IncomingMessage) => {
      try {
        const userId = this.authenticate(req);
        const queryParams = parse(req.url || '', true).query;
        const courseId = queryParams.courseId as string;

        if (!courseId) {
          throw new Error("Missing 'courseId' query parameter.");
        }

        if (this.activeSessions.has(userId)) {
          this.activeSessions.get(userId)?.close();
          this.activeSessions.delete(userId);

          logger.info(`Closed existing session for user: ${userId}`);
        }

        const session = await VoiceTutorSession.create(userId, courseId, ws);
        this.activeSessions.set(userId, session);

        logger.info(`Voice Tutor session started for user: ${userId}`);

        ws.on('message', (message: Buffer) => {
          const currentSession = this.activeSessions.get(userId);
          if (!currentSession) return;

          if (typeof message === 'string') {
            session.handleUserTranscript(message);
          } else {
            session.handleAudioChunk(message);
          }
        });

        ws.on('close', () => {
          const sessionToEnd = this.activeSessions.get(userId);

          if (sessionToEnd) {
            sessionToEnd.close();
            this.activeSessions.delete(userId);

            logger.info(`Voice Tutor session closed for user: ${userId}`);
          }
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

  /**
   * Authenticates a user from an incoming HTTP request by verifying the JWT in cookies.
   * @private
   * @param {IncomingMessage} req - The incoming HTTP request from the WebSocket handshake.
   * @returns {string} The authenticated user's ID.
   * @throws {Error} If authentication fails at any step (missing cookies, invalid signature, etc.).
   */
  private authenticate(req: IncomingMessage): string {
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) {
      throw new Error('Authentication failed: No cookie header.');
    }

    const cookies = cookie.parse(cookieHeader);
    const rawToken = cookies.token;
    if (!rawToken) {
      throw new Error('Authentication failed: No session token.');
    }

    const unsignedToken = cookieParser.signedCookie(
      rawToken,
      env.COOKIE_PARSER_SECRET
    );

    if (!unsignedToken) {
      throw new Error('Authentication failed: Invalid cookie signature.');
    }

    const payload = jwt.verify(unsignedToken, env.JWT_SECRET) as UserPayload;

    return payload.id;
  }
}
