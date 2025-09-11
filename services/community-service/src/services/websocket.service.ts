import * as cookie from 'cookie';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { IncomingMessage, Server } from 'node:http';
import { WebSocket, WebSocketServer } from 'ws';

import { eq } from 'drizzle-orm';
import { env } from '../config/env';
import logger from '../config/logger';
import { db } from '../db';
import { ConversationRepository, MessageRepository } from '../db/repositories';
import { Message, NewMessage, users } from '../db/schema';
import { MessageSentPublisher } from '../events/publisher';
import { UserPayload } from '../middlewares/current-user';
import { clientToServerMessageSchema } from '../schemas/chat.schema';
import { ChatService } from './chat.service';
import { PresenceService } from './presence.service';

export class WebSocketService {
  private wss: WebSocketServer;
  private clients: Map<string, WebSocket> = new Map();
  private presenceService: PresenceService;

  /**
   * Creates a new WebSocketService instance.
   * @param server - The HTTP server to attach the WebSocket server to.
   */
  constructor(server: Server) {
    this.wss = new WebSocketServer({ server });
    this.presenceService = new PresenceService(this);
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
    this.presenceService.userDidConnect(userId);

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
    this.presenceService.userDidDisconnect(userId);

    logger.info(
      `Client disconnected for user: ${userId}. Total clients: ${this.clients.size}`
    );
  }

  /**
   * Handles an incoming message from a client, validates it,
   * persists it, and broadcasts it to other participants.
   * @param senderId - The ID of the user who sent the message.
   * @param rawMessage - The raw message content from the WebSocket.
   */
  private async handleMessage(
    senderId: string,
    rawMessage: string
  ): Promise<void> {
    try {
      const messageData = JSON.parse(rawMessage);
      const validatedMessage =
        clientToServerMessageSchema.safeParse(messageData);

      if (!validatedMessage.success) {
        logger.warn('Received invalid message format from client: %o', {
          senderId,
          errors: validatedMessage.error.flatten(),
        });

        return;
      }

      const { type, payload } = validatedMessage.data;

      switch (type) {
        case 'DIRECT_MESSAGE': {
          const isParticipant = await ConversationRepository.isUserParticipant(
            payload.conversationId,
            senderId
          );
          if (!isParticipant) {
            logger.warn(
              `User ${senderId} attempted to send message to conversation ${payload.conversationId} they are not a part of.`
            );

            return;
          }

          const newMessage = await MessageRepository.create({
            conversationId: payload.conversationId,
            senderId,
            content: payload.content,
            replyingToMessageId: payload.replyingToMessageId,
          } as NewMessage);

          if (!newMessage || !newMessage.sender) {
            throw new Error(
              'Failed to create or retrieve message with sender.'
            );
          }

          try {
            const participantIds =
              await ConversationRepository.findParticipantIds(
                payload.conversationId
              );
            const recipientIds = participantIds.filter((id) => id !== senderId);

            await this.broadcastMessage(
              senderId,
              payload.conversationId,
              newMessage
            );

            if (recipientIds.length > 0) {
              const publisher = new MessageSentPublisher();
              await publisher.publish({
                messageId: newMessage.id,
                conversationId: newMessage.conversationId,
                senderId: newMessage.senderId,
                senderName: newMessage.sender.name,
                recipientIds: recipientIds,
                content: newMessage.content,
                createdAt: newMessage.createdAt.toISOString(),
              });
            }
          } catch (error) {
            logger.error('Failed to publish message.sent event', {
              messageId: newMessage.id,
              error,
            });
          }
          break;
        }

        case 'TYPING_START':
        case 'TYPING_STOP': {
          const isParticipant = await ConversationRepository.isUserParticipant(
            payload.conversationId,
            senderId
          );
          if (!isParticipant) return;

          const user = await db.query.users.findFirst({
            where: eq(users.id, senderId),
          });
          await this.broadcastTypingStatus(
            senderId,
            payload.conversationId,
            user?.name || 'Someone',
            type === 'TYPING_START'
          );
          break;
        }
        case 'REACT_TO_MESSAGE':
          await ChatService.toggleMessageReaction(
            payload.messageId,
            senderId,
            payload.emoji
          );
      }
    } catch (err) {
      const error = err as Error;
      logger.error('Error handling WebSocket message: %o', {
        senderId,
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    }
  }

  /**
   * Broadcasts the typing status of a user to other participants in a conversation.
   * @param senderId - The ID of the user typing.
   * @param conversationId - The conversation where typing occurs.
   * @param userName - The name of the user typing.
   * @param isTyping - Whether the user started or stopped typing.
   */
  private async broadcastTypingStatus(
    senderId: string,
    conversationId: string,
    userName: string,
    isTyping: boolean
  ): Promise<void> {
    const participantIds =
      await ConversationRepository.findParticipantIds(conversationId);

    const outgoingMessage = {
      type: 'TYPING_UPDATE',
      payload: {
        conversationId,
        userId: senderId,
        userName,
        isTyping,
      },
    };
    const messageString = JSON.stringify(outgoingMessage);

    for (const participantId of participantIds) {
      if (participantId !== senderId) {
        const clientSocket = this.clients.get(participantId);
        if (clientSocket && clientSocket.readyState === WebSocket.OPEN) {
          clientSocket.send(messageString);
        }
      }
    }
  }

  /**
   * Broadcasts a message to all online participants of a conversation,
   * excluding the original sender.
   * @param senderId - The ID of the message sender.
   * @param conversationId - The ID of the conversation.
   * @param message - The message object to broadcast.
   */
  public async broadcastMessage(
    senderId: string,
    conversationId: string,
    message: Message & {
      sender: { id: string; name: string | null; avatarUrl: string | null };
    }
  ): Promise<void> {
    const participantIds =
      await ConversationRepository.findParticipantIds(conversationId);

    const outgoingMessage = {
      type: 'NEW_MESSAGE',
      payload: {
        id: message.id,
        conversationId: message.conversationId,
        senderId: message.senderId,
        content: message.content,
        createdAt: message.createdAt.toISOString(),
        sender: message.sender,
      },
    };

    const messageString = JSON.stringify(outgoingMessage);

    for (const participantId of participantIds) {
      if (participantId !== senderId) {
        const clientSocket = this.clients.get(participantId);
        if (clientSocket && clientSocket.readyState === WebSocket.OPEN) {
          clientSocket.send(messageString);

          logger.info(`Message broadasted to use ${participantId}`);
        }
      }
    }
  }

  /**
   * Broadcasts a 'messages read' event to the relevant user.
   * @param conversationId The conversation where messages were read.
   * @param readByUserId The user who read the messages.
   */
  public async broadcastMessagesRead(
    conversationId: string,
    readByUserId: string
  ): Promise<void> {
    const participants =
      await ConversationRepository.findParticipantIds(conversationId);

    const senderToNotify = participants.find((id) => id !== readByUserId);

    if (senderToNotify) {
      const message = {
        type: 'MESSAGES_READ',
        payload: {
          conversationId,
          readByUserId,
          readAt: new Date().toISOString(),
        },
      };
      this.getClient(senderToNotify)?.send(JSON.stringify(message));
      logger.info(`Sent MESSAGES_READ update to user ${senderToNotify}`);
    }
  }

  /**
   * Broadcasts an emoji reaction update to all participants of a conversation.
   * @param conversationId - The conversation containing the message.
   * @param messageId - The message being reacted to.
   * @param reactions - The updated reactions map.
   */
  public async broadcastReactionUpdate(
    conversationId: string,
    messageId: string,
    reactions: Record<string, string[]>
  ): Promise<void> {
    const participantIds =
      await ConversationRepository.findParticipantIds(conversationId);
    const outgoingMessage = {
      type: 'REACTION_UPDATE',
      payload: { conversationId, messageId, reactions },
    };
    const messageString = JSON.stringify(outgoingMessage);

    for (const participantId of participantIds) {
      this.getClient(participantId)?.send(messageString);
    }

    logger.info(
      `Broadcasted REACTION_UPDATE for message ${messageId} to ${participantIds.length} participants.`
    );
  }

  /**
   * Retrieves the WebSocket connection for a given user.
   * @param userId - The user ID whose WebSocket to fetch.
   * @returns The WebSocket instance if found, otherwise undefined.
   */
  public getClient(userId: string): WebSocket | undefined {
    return this.clients.get(userId);
  }

  /**
   * Sends a presence update to a specific client.
   * @param recipientId The user to notify.
   * @param updatedUserId The user whose status changed.
   * @param status The new status ('online' or 'offline').
   */
  public sendPresenceUpdate(
    recipientId: string,
    updatedUserId: string,
    status: 'online' | 'offline'
  ): void {
    const clientSocket = this.clients.get(recipientId);

    if (clientSocket && clientSocket.readyState === WebSocket.OPEN) {
      const message = {
        type: 'PRESENCE_UPDATE',
        payload: {
          userId: updatedUserId,
          status,
        },
      };

      clientSocket.send(JSON.stringify(message));
    }
  }
}
