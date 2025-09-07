import { z } from 'zod';

/**
 * @openapi
 * components:
 *   schemas:
 *     GetMessagesParams:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Conversation ID
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
 *     Message:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         senderId:
 *           type: string
 *           format: uuid
 *         content:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
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
