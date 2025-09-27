import { z } from 'zod';

export const ExpiryValues = ['1hour', '24hours', '7days', 'never'] as const;
export type Expiry = (typeof ExpiryValues)[number];

/**
 * @openapi
 * components:
 *   schemas:
 *     GenerateShareLinkRequest:
 *       type: object
 *       properties:
 *         body:
 *           type: object
 *           required:
 *             - expiresIn
 *           properties:
 *             expiresIn:
 *               type: string
 *               description: Expiration time for the share link
 *               enum: [1hour, 24hours, 7days, never]
 *         params:
 *           type: object
 *           required:
 *             - roomId
 *           properties:
 *             roomId:
 *               type: string
 *               format: uuid
 *               description: The ID of the room to generate the share link for
 */
export const generateShareLinkSchema = z.object({
  body: z.object({
    expiresIn: z.enum(ExpiryValues),
  }),

  params: z.object({
    roomId: z.uuid(),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     InviteUsersRequest:
 *       type: object
 *       properties:
 *         params:
 *           type: object
 *           properties:
 *             roomId:
 *               type: string
 *               format: uuid
 *               description: The ID of the study room.
 *           required:
 *             - roomId
 *         body:
 *           type: object
 *           properties:
 *             userIds:
 *               type: array
 *               description: Array of user IDs to invite.
 *               items:
 *                 type: string
 *                 format: uuid
 *           required:
 *             - userIds
 *         query:
 *           type: object
 *           description: Optional query parameters (currently none defined)
 */
export const inviteUsersSchema = z.object({
  params: z.object({
    roomId: z.uuid('roomId must be a valid UUID'),
  }),

  body: z.object({
    userIds: z
      .array(z.uuid('Each userId must be a valid UUID'))
      .min(1, 'At least one userId must be provided'),
  }),

  query: z.object({}).optional(),
});
