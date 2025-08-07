import { z } from 'zod';
import { courseLevelEnum, lessonTypeEnum } from '../db/schema';

/**
 * @openapi
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         instructorId:
 *           type: string
 *           format: uuid
 *         status:
 *           type: string
 *           enum: [draft, published]
 *
 *     Module:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         courseId:
 *           type: string
 *           format: uuid
 *         order:
 *           type: integer
 *
 *     Lesson:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         moduleId:
 *           type: string
 *           format: uuid
 *         order:
 *           type: integer
 *         lessonType:
 *           type: string
 *           enum: [video, text, quiz]
 *         contentId:
 *           type: string
 *           nullable: true
 *           description: "The ID or URL of the lesson's content (e.g., video URL)."
 *
 *     CourseDetails:
 *       allOf:
 *         - $ref: '#/components/schemas/Course'
 *         - type: object
 *           properties:
 *             modules:
 *               type: array
 *               items:
 *                 allOf:
 *                  - $ref: '#/components/schemas/Module'
 *                  - type: object
 *                    properties:
 *                      lessons:
 *                        type: array
 *                        items:
 *                          $ref: '#/components/schemas/Lesson'
 *
 *     CreateCoursePayload:
 *       type: object
 *       required: [title]
 *       properties:
 *         title:
 *           type: string
 *           minLength: 3
 *           example: "Introduction to SQL"
 *         description:
 *           type: string
 *           example: "Learn the fundamentals of database management."
 *
 *     CreateModulePayload:
 *       type: object
 *       required: [title]
 *       properties:
 *         title:
 *           type: string
 *           minLength: 3
 *           example: "Chapter 1: Basic Queries"
 *
 *     CreateLessonPayload:
 *       type: object
 *       required: [title, lessonType]
 *       properties:
 *         title:
 *           type: string
 *           minLength: 3
 *           example: "SELECT Statements"
 *         lessonType:
 *           type: string
 *           enum: [video, text, quiz]
 *         content:
 *           type: string
 *           description: "The text content for a 'text' lesson."
 *           example: "The SELECT statement is used to query the database..."
 *
 *     ReorderPayload:
 *       type: object
 *       required: [ids]
 *       properties:
 *         ids:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: An array of IDs in the desired new order.
 *
 *     BulkCoursesSchema:
 *       type: object
 *       required: [ids]
 *       properties:
 *         ids:
 *           type: array
 *           items:
 *             type: string
 *             format: uuid
 *           description: An array of IDs.
 *
 *   securitySchemes:
 *      cookieAuth:
 *        type: apiKey
 *        in: cookie
 *        name: token
 */

export const createCourseSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'Title is required' })
      .min(3, 'Title must be at least 3 characters'),
    description: z.string().optional(),
    prerequisiteCourseId: z.string().uuid().optional().nullable(),
  }),
});

export const createModuleSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }).min(3),
  }),
});

export const createLessonSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }).min(3),
    lessonType: z.enum(lessonTypeEnum.enumValues),
    content: z.string().optional(),
  }),
});

export const listCoursesSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(12),
  }),
});

export const reorderSchema = z.object({
  body: z.object({
    ids: z.array(z.string().uuid()),
  }),
});

export const bulkCoursesSchema = z.object({
  body: z.object({
    courseIds: z
      .array(z.string().uuid())
      .nonempty('At least one course ID is required'),
  }),
});

// export const courseLevelEnum = z.enum([
//   'beginner',
//   'intermediate',
//   'advanced',
//   'all-levels',
// ]);

const CourseLevelValidationSchema = z.enum(courseLevelEnum.enumValues);

export const createCoursePayloadSchema = z.object({
  title: z.string().min(3),
  categoryId: z.string().uuid().optional().nullable(),
  level: CourseLevelValidationSchema.optional(),
  price: z.number().positive().optional().nullable(),
  currency: z.string().length(3).optional().nullable(),
});

export const updateCoursePayloadSchema = createCoursePayloadSchema.partial();

export const updateCoursePriceSchema = z.object({
  body: z.object({
    price: z.coerce
      .number()
      .min(0, 'Price must be a positive number.')
      .positive()
      .optional()
      .nullable(),
  }),
});

export const PriceFilter = z.enum(['free', 'paid']).optional();
export const DurationFilter = z
  .string()
  .regex(/^\d+(-\d+)?$/)
  .optional();
export const SortByFilter = z
  .enum(['newest', 'rating', 'popularity'])
  .default('newest');

export const getCoursesQuerySchema = z.object({
  query: z.string().optional(),
  categoryId: z.string().uuid().optional(),
  level: CourseLevelValidationSchema.optional(),
  price: PriceFilter,
  duration: DurationFilter,
  sortBy: SortByFilter,
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export type GetCoursesQuery = z.infer<typeof getCoursesQuerySchema>;
export type GetCoursesByInstructorOptions = GetCoursesQuery & {
  instructorId: string;
};
