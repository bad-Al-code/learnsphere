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
 *           example: 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
 *         firstName:
 *           type: string
 *           nullable: true
 *           example: 'John'
 *         lastName:
 *           type: string
 *           nullable: true
 *           example: 'Doe'
 *         bio:
 *           type: string
 *           nullable: true
 *           example: 'Software developer and lifelong learner.'
 *         headline:
 *           type: string
 *           nullable: true
 *           example: 'Building the future, one line of code at a time.'
 *         avatarUrls:
 *           type: object
 *           nullable: true
 *           properties:
 *             small:
 *               type: string
 *               format: url
 *             medium:
 *               type: string
 *               format: url
 *             large:
 *               type: string
 *               format: url
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
 *     AvatarUploadUrlRequest:
 *       type: object
 *       required:
 *         - filename
 *       properties:
 *         filename:
 *           type: string
 *           example: 'my-avatar.jpg'
 *     AvatarUploadUrlResponse:
 *       type: object
 *       properties:
 *         uploadUrl:
 *           type: string
 *           format: url
 *           description: The presigned URL to which the client should upload the file.
 *         key:
 *           type: string
 *           description: The object key for the uploaded file in the storage bucket.
 *     BulkUserRequest:
 *       type: object
 *       required:
 *         - userIds
 *       properties:
 *         userIds:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *     UserSettings:
 *       type: object
 *       properties:
 *         theme:
 *           type: string
 *           enum: [light, dark]
 *         language:
 *           type: string
 *           enum: [en, es, fr]
 *         notifications:
 *           type: object
 *           properties:
 *             newCourseAlerts:
 *               type: boolean
 *             weeklyNewsletter:
 *               type: boolean
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

export const updateSettingsSchema = z.object({
  body: z
    .object({
      theme: z.enum(['light', 'dark']).optional(),
      language: z.enum(['en', 'es', 'fr']).optional(),
      Notification: z
        .object({
          newCourseAlerts: z.boolean().optional(),
          weeklyNewsletter: z.boolean().optional(),
        })
        .optional(),
    })
    .partial(),
});

export const fcmTokenSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'FCM token is required'),
  }),
});
