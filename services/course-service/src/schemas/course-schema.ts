import { z } from 'zod';
import {
  courseLevelEnum,
  courseStatusEnum,
  lessonTypeEnum,
} from '../db/schema';

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

export const moduleCreateSchema = z.object({
  title: z.string().min(3),
  courseId: z.string().uuid(),
  isPublished: z.boolean().optional().default(false),
});
export type CreateModuleDto = z.infer<typeof moduleCreateSchema>;

export const moduleUpdateSchema = z
  .object({
    title: z.string().min(3).optional(),
    isPublished: z.boolean().optional(),
  })
  .strict();

export const createLessonSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }).min(3),
    lessonType: z.enum(lessonTypeEnum.enumValues),
    content: z.string().optional(),
  }),
});

export const lessonCreateSchema = z.object({
  title: z.string().min(3),
  moduleId: z.string().uuid(),
  lessonType: z.enum(lessonTypeEnum.enumValues),
  isPublished: z.boolean().optional().default(false),
  content: z.string().optional(),
  duration: z.number().int().min(0).optional().default(0),
});

export type CreateLessonDto = z.infer<typeof lessonCreateSchema>;

export const updateLessonSchema = z.object({
  body: createLessonSchema.shape.body.partial(),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     ListCoursesQuery:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *           description: The page number for pagination (starts at 1).
 *           example: 1
 *         limit:
 *           type: integer
 *           minimum: 1
 *           maximum: 1000
 *           default: 12
 *           description: The number of courses to return per page.
 *           example: 12
 *         categoryId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: Optional category ID to filter courses by.
 *           example: "550e8400-e29b-41d4-a716-446655440000"
 *         level:
 *           type: string
 *           nullable: true
 *           description: Optional course difficulty level to filter by.
 *           enum: ["beginner", "intermediate", "advanced"]
 *           example: "beginner"
 */
export const listCoursesSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(1000).default(12),
    categoryId: z.string().uuid('Invalid category ID format').optional(),
    level: z
      .enum(['beginner', 'intermediate', 'advanced', 'all-levels'])
      .optional(),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     FilenameRequest:
 *       type: object
 *       required:
 *         - filename
 *       properties:
 *         filename:
 *           type: string
 *           description: Name of the file to be processed.
 *           example: "document.pdf"
 */
export const filenameSchema = z.object({
  body: z.object({
    filename: z.string().min(1, 'Filename is required and cannot be empty'),
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
  description: z.string().optional().nullable(),
  categoryId: z.string().uuid().optional().nullable(),
  level: CourseLevelValidationSchema.optional(),
  status: z.enum(courseStatusEnum.enumValues).optional(),
  price: z.number().positive().min(0).optional().nullable(),
  currency: z.string().length(3).default('INR').optional().nullable(),
  imageUrl: z
    .string()
    .url('A valid image URL is required.')
    .optional()
    .nullable(),
  prerequisiteCourseId: z
    .string()
    .uuid('Invalid prerequisite course ID.')
    .optional()
    .nullable(),
  duration: z
    .number()
    .int()
    .min(0, 'Duration must be a positive number.')
    .optional()
    .nullable(),

  modules: z
    .array(
      z.object({
        title: z.string().min(1, 'Module title cannot be empty.'),
      })
    )
    .min(1, 'At least one module is required.'),
});

/**
 * @description Zod schema for validating the entire request for creating a full course.
 * It ensures the request has a `body` object that conforms to the `createCoursePayloadSchema`.
 */ export const createFullCourseRequestSchema = z.object({
  body: createCoursePayloadSchema,
});

/**
 * @description TypeScript type inferred from the Zod schema for the course creation payload.
 * This is used for type-safety in service and repository layers.
 */

export type CreateFullCourseDto = z.infer<typeof createCoursePayloadSchema>;

/**
 * @description Zod schema for partially updating a course.
 */
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
  q: z.string().optional(),
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

/**
 * @openapi
 * components:
 *   parameters:
 *     courseId:
 *       name: courseId
 *       in: path
 *       required: true
 *       description: Unique identifier of the course.
 *       schema:
 *         type: string
 *         format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 */
export const courseIdParamSchema = z.object({
  params: z.object({
    courseId: z.string().uuid('Course ID is not valid.'),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     PriceRequest:
 *       type: object
 *       required:
 *         - price
 *       properties:
 *         price:
 *           type: string
 *           nullable: true
 *           description: The price of the item. Can be null if not set.
 *           example: "19.99"
 */
export const priceSchema = z.object({
  body: z.object({
    price: z
      .string({ invalid_type_error: 'Price must be a string or null' })
      .nullable(),
  }),
});
