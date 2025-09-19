import * as cookie from 'cookie';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { IncomingMessage, Server } from 'node:http';
import { parse } from 'node:url';
import { WebSocket, WebSocketServer } from 'ws';

import { env } from '../config/env';
import logger from '../config/logger';
import { VoiceTutorSession } from '../features/ai/voice-tutor/live-session';
import { UserPayload } from '../middlewares/current-user';

export class WebSocketService {
  private wss: WebSocketServer;
  private activeSessions: Map<string, VoiceTutorSession> = new Map();

  constructor(server: Server) {
    this.wss = new WebSocketServer({
      server,
      path: '/api/ai/voice-tutor',
      perMessageDeflate: false,
      maxPayload: 1024 * 1024 * 10,
    });

    logger.info(`WebSocketService initialized on /api/ai/voice-tutor`);
  }

  public start() {
    this.wss.on('connection', async (ws: WebSocket, req: IncomingMessage) => {
      let userId: string;
      let courseId: string;

      try {
        userId = this.authenticate(req);
        const queryParams = parse(req.url || '', true).query;
        courseId = queryParams.courseId as string;

        if (!courseId) {
          throw new Error("Missing 'courseId' query parameter.");
        }

        logger.info(
          `WebSocket connection attempt for user: ${userId}, course: ${courseId}`
        );

        if (this.activeSessions.has(userId)) {
          const existingSession = this.activeSessions.get(userId);
          existingSession?.close();
          this.activeSessions.delete(userId);
          logger.info(`Closed existing session for user: ${userId}`);
        }

        const session = await VoiceTutorSession.create(userId, courseId, ws);
        this.activeSessions.set(userId, session);
        logger.info(`Voice Tutor session started for user: ${userId}`);

        ws.on('message', async (data: Buffer | string) => {
          const currentSession = this.activeSessions.get(userId);
          if (!currentSession) {
            logger.warn(`No active session found for user: ${userId}`);
            return;
          }

          try {
            if (Buffer.isBuffer(data)) {
              await currentSession.handleAudioChunk(data);
            } else if (typeof data === 'string') {
              const trimmedData = data.trim();

              if (trimmedData) {
                await currentSession.handleUserTranscript(trimmedData);
              }
            } else {
              const buffer = Buffer.from(data);

              if (buffer.length > 0) {
                await currentSession.handleAudioChunk(buffer);
              }
            }
          } catch (error) {
            const errorMessage =
              error instanceof Error ? error.message : 'Unknown error';

            logger.error('Error handling WebSocket message %o', {
              userId,
              courseId,
              error: errorMessage,
              dataType: Buffer.isBuffer(data) ? 'Buffer' : typeof data,
              dataSize: Buffer.isBuffer(data)
                ? data.length
                : data.toString().length,
            });

            if (ws.readyState === WebSocket.OPEN) {
              try {
                const errorData = JSON.stringify({
                  type: 'error',
                  message: 'Failed to process message',
                  details: errorMessage,
                  timestamp: new Date().toISOString(),
                });

                ws.send(errorData);
              } catch (sendError) {
                logger.error('Failed to send error message to client', {
                  sendError,
                });
              }
            }
          }
        });

        ws.on('close', (code: number, reason: Buffer) => {
          const sessionToEnd = this.activeSessions.get(userId);

          if (sessionToEnd) {
            try {
              sessionToEnd.close();
              this.activeSessions.delete(userId);

              logger.info(`Voice Tutor session closed for user: ${userId} %o`, {
                code,
                reason: reason.toString(),
                courseId,
              });
            } catch (error) {
              logger.error(`Error closing session for user: ${userId}`, {
                error,
              });
            }
          }
        });

        ws.on('error', (error: Error) => {
          logger.error('WebSocket error for user', {
            userId,
            courseId,
            error: error.message,
            stack: error.stack,
          });

          const sessionToEnd = this.activeSessions.get(userId);
          if (sessionToEnd) {
            try {
              sessionToEnd.close();
              this.activeSessions.delete(userId);
            } catch (closeError) {
              logger.error(
                `Error closing session after WebSocket error for user: ${userId}`,
                { closeError }
              );
            }
          }
        });

        const pingInterval = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.ping();
          } else {
            clearInterval(pingInterval);
          }
        }, 30000);

        ws.on('pong', () => {
          logger.debug(`Received pong from user: ${userId}`);
        });

        ws.on('close', () => {
          clearInterval(pingInterval);
        });
      } catch (error) {
        const err = error as Error;

        logger.warn('WebSocket connection rejected %o', {
          message: err.message,
          name: err.name,
          url: req.url,
          userAgent: req.headers['user-agent'],
        });

        try {
          ws.close(1008, err.message);
        } catch (closeError) {
          logger.error('Failed to close WebSocket after rejection', {
            closeError,
          });
        }
      }
    });

    this.wss.on('error', (error: Error) => {
      logger.error('WebSocket server error: %o', {
        message: error.message,
        stack: error.stack,
      });
    });

    this.wss.on('listening', () => {
      logger.info('WebSocket server is listening');
    });
  }

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

    let unsignedToken: string | false;
    try {
      unsignedToken = cookieParser.signedCookie(
        rawToken,
        env.COOKIE_PARSER_SECRET
      );
    } catch (cookieError) {
      throw new Error('Authentication failed: Error parsing cookie.');
    }

    if (!unsignedToken) {
      throw new Error('Authentication failed: Invalid cookie signature.');
    }

    try {
      const payload = jwt.verify(unsignedToken, env.JWT_SECRET) as UserPayload;
      if (!payload.id) {
        throw new Error('Authentication failed: Invalid token payload.');
      }

      return payload.id;
    } catch (jwtError) {
      const errorMessage =
        jwtError instanceof Error ? jwtError.message : 'Unknown JWT error';
      throw new Error(
        `Authentication failed: Invalid JWT token - ${errorMessage}`
      );
    }
  }

  public shutdown(): Promise<void> {
    return new Promise((resolve) => {
      logger.info('Starting WebSocket server shutdown...');

      const closePromises: Promise<void>[] = [];

      for (const [userId, session] of this.activeSessions.entries()) {
        const closePromise = new Promise<void>((sessionResolve) => {
          try {
            session.close();

            logger.info(`Closed session for user ${userId} during shutdown`);
            sessionResolve();
          } catch (error) {
            logger.error(`Error closing session for user ${userId}`, { error });
            sessionResolve();
          }
        });
        closePromises.push(closePromise);
      }

      Promise.all(closePromises).then(() => {
        this.activeSessions.clear();

        this.wss.close(() => {
          logger.info('WebSocket server shut down successfully');
          resolve();
        });
      });
    });
  }

  public getActiveSessionCount(): number {
    return this.activeSessions.size;
  }

  public getActiveUsers(): string[] {
    return Array.from(this.activeSessions.keys());
  }

  public getSessionInfo(): Array<{ userId: string; timestamp: string }> {
    return Array.from(this.activeSessions.entries()).map(([userId]) => ({
      userId,
      timestamp: new Date().toISOString(),
    }));
  }
}
