import { z } from 'zod';
import { waitlistRoleEnum } from '../db/schema';

/**
 * @openapi
 * components:
 *   schemas:
 *     JoinWaitlistPayload:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user joining the waitlist.
 *           example: 'new.user@example.com'
 */
export const waitlistSchema = z.object({
  body: z.object({
    email: z
      .string()
      .min(1, 'Email address is required.')
      .email('Please provide a valid email address.')
      .max(255, 'Email address is too long.')
      .trim()
      .toLowerCase(),
    referredByCode: z.string().max(8).optional().nullable(),
    role: z.enum(waitlistRoleEnum.enumValues).optional(),
  }),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>['body'];

/**
 * @openapi
 * components:
 *   schemas:
 *     JoinWaitlistResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates if the operation was successful.
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               description: The unique identifier for the waitlist entry.
 *             email:
 *               type: string
 *               format: email
 *               description: The email address that was added.
 *             createdAt:
 *               type: string
 *               format: date-time
 *               description: The timestamp when the user joined the waitlist.
 *         message:
 *           type: string
 *           description: Success message.
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     CheckEmailResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates if the operation was successful.
 *         data:
 *           type: object
 *           properties:
 *             exists:
 *               type: boolean
 *               description: Whether the email exists in the waitlist.
 *             email:
 *               type: string
 *               format: email
 *               description: The email that was checked (only if exists is true).
 *             referredByCode:
 *               type: string
 *               maxLength: 8
 *               description: An optional referral code from another user.
 *               example: 'REF12345'
 */
export const checkEmailSchema = z.object({
  query: z.object({
    email: z
      .string()
      .min(1, 'Email address is required.')
      .email('Please provide a valid email address.')
      .max(255, 'Email address is too long.')
      .trim()
      .toLowerCase(),
  }),
});

export type CheckEmailInput = z.infer<typeof checkEmailSchema>['query'];

/**
 * @openapi
 * components:
 *   schemas:
 *     WaitlistStatsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates if the operation was successful.
 *         data:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               description: Total number of waitlist entries.
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     GetWaitlistStatusPayload:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The email address to check the waitlist status for.
 *           example: 'status.user@example.com'
 *     GetWaitlistStatusResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates if the operation was successful.
 *         data:
 *           type: object
 *           properties:
 *             status:
 *               type: string
 *               enum: [pending, approved, rejected]
 *               description: The current waitlist status of the user.
 *             position:
 *               type: integer
 *               description: The user's position in the waitlist (if applicable).
 *         message:
 *           type: string
 *           description: Additional information about the waitlist status.
 */

export const getWaitlistStatusSchema = z.object({
  query: z.object({
    email: z
      .string()
      .min(1, 'Email address is required.')
      .email('Please provide a valid email address.')
      .max(255, 'Email address is too long.')
      .trim()
      .toLowerCase(),
  }),
});

export const waitlistStatusResponseSchema = z.object({
  waitlistPosition: z.number().int(),
  referralCount: z.number().int(),
  referralCode: z.string(),
  rewardsUnlocked: z.array(z.string()),
});

export type WaitlistStatusResponse = z.infer<
  typeof waitlistStatusResponseSchema
>;

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateInterestsPayload:
 *       type: object
 *       required:
 *         - email
 *         - interests
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user on the waitlist.
 *         interests:
 *           type: array
 *           items:
 *             type: string
 *           description: An array of interest tags.
 *           example: ["Web Development", "AI/ML"]
 */
export const updateInterestsSchema = z.object({
  body: z.object({
    email: z
      .string()
      .min(1)
      .max(100)
      .email('Please provide a valid email address.')
      .trim()
      .toLowerCase(),
    interests: z
      .array(
        z
          .string()
          .min(1, 'Interests tags cannot be empty.')
          .max(50, 'Interest tags must be 50 characters or less.')
      )
      .min(1, 'Please select at least one interest.')
      .max(5, 'You can select a maximum of 5 interests.'),
  }),
});

export type UpdateInterestsInput = z.infer<
  typeof updateInterestsSchema
>['body'];
