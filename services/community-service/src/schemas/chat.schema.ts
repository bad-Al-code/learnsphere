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
 *         conversationId:
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
 *           required:
 *             - id
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
 *           enum: [DIRECT_MESSAGE, TYPING_START, TYPING_STOP, REACT_TO_MESSAGE]
 *         payload:
 *           oneOf:
 *             - type: object
 *               required: [conversationId, content]
 *               properties:
 *                 conversationId:
 *                   type: string
 *                   format: uuid
 *                 content:
 *                   type: string
 *                   minLength: 1
 *                   maxLength: 2000
 *                 replyingToMessageId:
 *                   type: string
 *                   format: uuid
 *                   nullable: true
 *             - type: object
 *               required: [conversationId]
 *               properties:
 *                 conversationId:
 *                   type: string
 *                   format: uuid
 *             - type: object
 *               required: [messageId, emoji]
 *               properties:
 *                 messageId:
 *                   type: string
 *                   format: uuid
 *                 emoji:
 *                   type: string
 *                   description: Emoji reaction (e.g. 👍, ❤️)
 *
 *     ServerToClientMessage:
 *       type: object
 *       required:
 *         - type
 *         - payload
 *       properties:
 *         type:
 *           type: string
 *           enum: [NEW_MESSAGE, TYPING_UPDATE, REACTION_UPDATE]
 *         payload:
 *           oneOf:
 *             - $ref: '#/components/schemas/Message'
 *             - type: object
 *               required: [conversationId, userId, isTyping]
 *               properties:
 *                 conversationId:
 *                   type: string
 *                   format: uuid
 *                 userId:
 *                   type: string
 *                   format: uuid
 *                 isTyping:
 *                   type: boolean
 *             - type: object
 *               required: [conversationId, messageId, reactions]
 *               properties:
 *                 conversationId:
 *                   type: string
 *                   format: uuid
 *                 messageId:
 *                   type: string
 *                   format: uuid
 *                 reactions:
 *                   type: object
 *                   additionalProperties:
 *                     type: array
 *                     items:
 *                       type: string
 *                       format: uuid
 *                   description: |
 *                     Map of emoji → list of user IDs who reacted.
 *                     Example: { "👍": ["user-id-1", "user-id-2"], "❤️": ["user-id-3"] }
 *
 *     CreateConversation:
 *       type: object
 *       required:
 *         - recipientId
 *       properties:
 *         recipientId:
 *           type: string
 *           format: uuid
 *           description: ID of the user to start a direct conversation with
 *
 *     CreateGroupConversation:
 *       type: object
 *       required:
 *         - name
 *         - participantIds
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *           description: Group name
 *         participantIds:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           minItems: 1
 *           description: IDs of participants to include in the group
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

export const conversationIdSchema = z.object({
  params: z.object({
    id: z.uuid('Invalid conversation ID format.'),
  }),
});

export const clientToServerMessageSchema = z.union([
  z.object({
    type: z.literal('DIRECT_MESSAGE'),
    payload: z.object({
      conversationId: z.uuid(),
      content: z.string().min(1).max(2000),
      replyingToMessageId: z.uuid().optional(),
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
  z.object({
    type: z.literal('REACT_TO_MESSAGE'),
    payload: z.object({
      messageId: z.uuid(),
      emoji: z.string().min(1),
    }),
  }),
]);
export type ClientToServerMessage = z.infer<typeof clientToServerMessageSchema>;

export const serverToClientMessageSchema = z.union([
  z.object({
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
  }),
  z.object({
    type: z.literal('TYPING_UPDATE'),
    payload: z.object({
      conversationId: z.uuid(),
      userId: z.uuid(),
      isTyping: z.boolean(),
    }),
  }),
  z.object({
    type: z.literal('REACTION_UPDATE'),
    payload: z.object({
      conversationId: z.uuid(),
      messageId: z.uuid(),
      reactions: z.record(z.string(), z.array(z.uuid())),
    }),
  }),
]);

export type ServerToClientMessage = z.infer<typeof serverToClientMessageSchema>;

export const createConversationSchema = z.object({
  body: z.object({
    recipientId: z.uuid('Invalid recipient ID format.'),
  }),
});
export type CreateConversation = z.infer<typeof createConversationSchema>;

export const createGroupConversationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Group name is required.').max(100),
    participantIds: z
      .array(z.uuid())
      .min(1, 'At least one other participant is required.'),
  }),
});
export type createGroupConversation = z.infer<
  typeof createGroupConversationSchema
>;

export const getStudyRoomsSchema = z.object({
  query: z.object({
    q: z.string().min(1, 'Query cannot be empty').optional(),
    topic: z.string().min(1, 'Topic cannot be empty').optional(),
  }),
});
