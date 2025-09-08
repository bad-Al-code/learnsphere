import { z } from 'zod';

export const getMessagesSchema = z.object({
  params: z.object({
    id: z.uuid('Invalid conversation ID format.'),
  }),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(50),
  }),
});

export const clientToServerMessageSchema = z.object({
  type: z.literal('DIRECT_MESSAGE'),
  payload: z.object({
    conversationId: z.uuid(),
    content: z.string().max(2000),
  }),
});
export type ClientToServerMessage = z.infer<typeof clientToServerMessageSchema>;

export const serverToClientMessageSchema = z.object({
  type: z.literal('NEW_MESSAGE'),
  payload: z.object({
    id: z.uuid(),
    conversationId: z.uuid(),
    senderId: z.uuid(),
    content: z.string(),
    createdAt: z.string(),
    sender: z.object({
      id: z.uuid(),
      name: z.string().nullable(),
      avatarUrl: z.string().nullable(),
    }),
  }),
});
export type ServerToClientMessage = z.infer<typeof serverToClientMessageSchema>;
