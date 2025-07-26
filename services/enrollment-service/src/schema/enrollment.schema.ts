import { z } from 'zod';

/**
 * @openapi
 * components:
 *   schemas:
 *     Enrollment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         status:
 *           type: string
 *           enum: [active, suspended, completed]
 *         userId:
 *           type: string
 *           format: uuid
 *         courseId:
 *           type: string
 *           format: uuid
 *         progressPercentage:
 *           type: number
 *           format: float
 *         enrolledAt:
 *           type: string
 *           format: date-time
 *
 *     CreateEnrollmentPayload:
 *       type: object
 *       required: [courseId]
 *       properties:
 *         courseId:
 *           type: string
 *           format: uuid
 *
 *     MarkProgressPayload:
 *       type: object
 *       required: [courseId, lessonId]
 *       properties:
 *         courseId:
 *           type: string
 *           format: uuid
 *         lessonId:
 *           type: string
 *           format: uuid
 *
 *     ProgressResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Progress updated successfully"
 *         progressPercentage:
 *           type: number
 *           format: float
 *
 *   securitySchemes:
 *      cookieAuth:
 *        type: apiKey
 *        in: cookie
 *        name: token
 */

export const createEnrollmentSchema = z.object({
  body: z.object({
    courseId: z
      .string({ required_error: 'Course ID is required' })
      .uuid('Invalid course ID format'),
  }),
});

export const markProgressSchema = z.object({
  body: z.object({
    courseId: z.string().uuid('Invalid course ID format'),
    lessonId: z.string().uuid('Invalid lesson ID format'),
  }),
});

export const manualEnrollmentSchema = z.object({
  body: z.object({
    userId: z.string().uuid('Invalid user ID format'),
    courseId: z.string().uuid('Invalid course ID format'),
  }),
});

export const enrollmentIdParamSchema = z.object({
  params: z.object({
    enrollmentId: z.string().uuid('Invalid enrollment ID format'),
  }),
});

export const getEnrollmentsSchema = z.object({
  params: z.object({
    courseId: z.string().uuid('Invalid course ID format'),
  }),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
});
