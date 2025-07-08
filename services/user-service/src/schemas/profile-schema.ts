import { z } from 'zod';

/**
 * @openapi
 * components:
 *   schemas:
 *     ProfileResponse:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *         firstName:
 *           type: string
 *           nullable: true
 *         lastName:
 *           type: string
 *           nullable: true
 *         bio:
 *           type: string
 *           nullable: true
 *         headline:
 *           type: string
 *           nullable: true
 *         avatarUrls:
 *           type: object
 *           properties:
 *             small:
 *               type: string
 *             medium:
 *               type: string
 *             large:
 *               type: string
 *     UpdateProfilePayload:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           example: 'John'
 *         lastName:
 *           type: string
 *           example: 'Doe'
 *         bio:
 *           type: string
 *           example: 'Software developer and lifelong learner.'
 *         headline:
 *           type: string
 *           example: 'Building the future, one line of code at a time.'
 *   securitySchemes:
 *      cookieAuth:
 *        type: apiKey
 *        in: cookie
 *        name: token
 */

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    bio: z.string().max(500).optional(),
    headline: z.string().max(100).optional().nullable(),
    websiteUrl: z
      .string()
      .url({ message: 'Invalid URL format' })
      .optional()
      .nullable(),
    socialLinks: z
      .object({
        twitter: z.string().optional(),
        linkedin: z.string().optional(),
        github: z.string().optional(),
      })
      .optional()
      .nullable(),
  }),
});

export const avatarUploadUrlSchema = z.object({
  body: z.object({
    filename: z.string(),
  }),
});

export const searchProfileSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});

export const bulkUsersSchema = z.object({
  body: z.object({
    userIds: z.array(z.string().uuid()).nonempty(),
  }),
});
