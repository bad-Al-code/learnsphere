import { z } from 'zod';

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateEnrollmentPayload:
 *       type: object
 *       required: [courseId]
 *       properties:
 *         courseId:
 *           type: string
 *           format: uuid
 */
export const createEnrollmentSchema = z.object({
  body: z.object({
    courseId: z
      .string({ required_error: 'Course ID is required' })
      .uuid('Invalid course ID format'),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
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
 */
export const markProgressSchema = z.object({
  body: z.object({
    courseId: z.string().uuid('Invalid course ID format'),
    lessonId: z.string().uuid('Invalid lesson ID format'),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     ManualEnrollmentPayload:
 *       type: object
 *       required: [userId, courseId]
 *       properties:
 *         userId:
 *           type: string
 *           format: uuid
 *         courseId:
 *           type: string
 *           format: uuid
 */
export const manualEnrollmentSchema = z.object({
  body: z.object({
    userId: z.string().uuid('Invalid user ID format'),
    courseId: z.string().uuid('Invalid course ID format'),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     EnrollmentIdParam:
 *       type: object
 *       required: [enrollmentId]
 *       properties:
 *         enrollmentId:
 *           type: string
 *           format: uuid
 */
export const enrollmentIdParamSchema = z.object({
  params: z.object({
    enrollmentId: z.string().uuid('Invalid enrollment ID format'),
  }),
});

export const courseIdParamSchema = z.object({
  params: z.object({
    courseId: z.string().uuid('Invalid courseId format.'),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     GetEnrollmentsParams:
 *       type: object
 *       required: [courseId]
 *       properties:
 *         courseId:
 *           type: string
 *           format: uuid
 *
 *     GetEnrollmentsQuery:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         limit:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 */
export const getEnrollmentsSchema = z.object({
  params: z.object({
    courseId: z.string().uuid('Invalid course ID format'),
  }),
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     StartSessionPayload:
 *       type: object
 *       required: [courseId, moduleId, lessonId]
 *       properties:
 *         courseId:
 *           type: string
 *           format: uuid
 *         moduleId:
 *           type: string
 *           format: uuid
 *         lessonId:
 *           type: string
 *           format: uuid
 */
export const startSessionSchema = z.object({
  body: z.object({
    courseId: z.string().uuid(),
    moduleId: z.string().uuid(),
    lessonId: z.string().uuid(),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     EndSessionPayload:
 *       type: object
 *       required: [sessionId]
 *       properties:
 *         sessionId:
 *           type: string
 *           format: uuid
 */
export const endSessionSchema = z.object({
  body: z.object({
    sessionId: z.string().uuid(),
  }),
});

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
 *     ProgressResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: "Progress updated successfully"
 *         progressPercentage:
 *           type: number
 *           format: float
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     EnrolledCoursesSortEnum:
 *       type: string
 *       enum:
 *         - Recently Accessed
 *         - Progress %
 *         - Alphabetical
 */
export const EnrolledCoursesSortEnum = z.enum([
  'Recently Accessed',
  'Progress %',
  'Alphabetical',
]);

export type EnrolledCoursesSortEnumType = z.infer<
  typeof EnrolledCoursesSortEnum
>;

/**
 * @openapi
 * components:
 *   schemas:
 *     GetMyCoursesQuery:
 *       type: object
 *       properties:
 *         q:
 *           type: string
 *           description: Optional search term for filtering enrolled courses
 *         sortBy:
 *           $ref: '#/components/schemas/EnrolledCoursesSortEnum'
 *           default: Recently Accessed
 *         filterBy:
 *           $ref: '#/components/schemas/EnrolledCoursesFilterEnum'
 *           default: All Courses
 *         page:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         limit:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 6
 */
export const getMyCoursesQuerySchema = z.object({
  query: z.object({
    q: z.string().optional(),
    sortBy: EnrolledCoursesSortEnum.default('Recently Accessed'),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(6),
  }),
});

export type GetMyCoursesQuery = z.infer<
  typeof getMyCoursesQuerySchema
>['query'];
