import { z } from 'zod';

/**
 * @description Schema for messages sent FROM the client TO the server.
 */
export const clientToServerMessageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('DIRECT_MESSAGE'),
    payload: z.object({
      conversationId: z.uuid(),
      content: z.string().min(1, 'Message cannot be empty.').max(2000),
    }),
  }),
  z.object({
    type: z.literal('TYPING_START'),
    payload: z.object({ conversationId: z.uuid() }),
  }),
  z.object({
    type: z.literal('TYPING_STOP'),
    payload: z.object({ conversationId: z.uuid() }),
  }),
]);
export type ClientToServerMessage = z.infer<typeof clientToServerMessageSchema>;

/**
 * @description Schema for messages sent FROM the server TO the client.
 */
export const serverToClientMessageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('NEW_MESSAGE'),
    payload: z.object({
      id: z.uuid(),
      conversationId: z.uuid(),
      senderId: z.uuid(),
      content: z.string(),
      createdAt: z.iso.datetime(),
      sender: z
        .object({
          id: z.uuid(),
          name: z.string().nullable(),
          avatarUrl: z.string().nullable(),
        })
        .nullable(),
    }),
  }),
  z.object({
    type: z.literal('PRESENCE_UPDATE'),
    payload: z.object({
      userId: z.uuid(),
      status: z.enum(['online', 'offline']),
    }),
  }),
  z.object({
    type: z.literal('TYPING_UPDATE'),
    payload: z.object({
      conversationId: z.uuid(),
      userId: z.uuid(),
      userName: z.string().nullable(),
      isTyping: z.boolean(),
    }),
  }),
  z.object({
    type: z.literal('MESSAGES_READ'),
    payload: z.object({
      conversationId: z.uuid(),
      readByUserId: z.uuid(),
      readAt: z.iso.datetime(),
    }),
  }),
]);
export type ServerToClientMessage = z.infer<typeof serverToClientMessageSchema>;
