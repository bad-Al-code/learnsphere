import { z } from 'zod';

/**
 * @openapi
 * components:
 *   schemas:
 *     GetMessagesParams:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Conversation ID
 *
 *     GetMessagesQuery:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *           description: Page number (starting at 1)
 *         limit:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *           description: Number of messages per page
 *
 *     Message:
 *       type: object
 *       required:
 *         - id
 *         - senderId
 *         - content
 *         - createdAt
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         senderId:
 *           type: string
 *           format: uuid
 *         content:
 *           type: string
 *           maxLength: 2000
 *         createdAt:
 *           type: string
 *           format: date-time
 *         sender:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *             name:
 *               type: string
 *               nullable: true
 *             avatarUrl:
 *               type: string
 *               nullable: true
 *
 *     PaginatedMessagesResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Message'
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *         total:
 *           type: integer
 *
 *     ClientToServerMessage:
 *       type: object
 *       required:
 *         - type
 *         - payload
 *       properties:
 *         type:
 *           type: string
 *           enum: [DIRECT_MESSAGE]
 *         payload:
 *           type: object
 *           required:
 *             - conversationId
 *             - content
 *           properties:
 *             conversationId:
 *               type: string
 *               format: uuid
 *             content:
 *               type: string
 *               maxLength: 2000
 *
 *     ServerToClientMessage:
 *       type: object
 *       required:
 *         - type
 *         - payload
 *       properties:
 *         type:
 *           type: string
 *           enum: [NEW_MESSAGE]
 *         payload:
 *           $ref: '#/components/schemas/Message'
 */
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
    createdAt: z.coerce.date(),
    sender: z.object({
      id: z.uuid(),
      name: z.string().nullable(),
      avatarUrl: z.string().nullable(),
    }),
  }),
});
export type ServerToClientMessage = z.infer<typeof serverToClientMessageSchema>;
