import { z } from 'zod';

/**
 * @openapi
 * components:
 *   parameters:
 *     moduleId:
 *       name: moduleId
 *       in: path
 *       required: true
 *       description: Unique identifier of the module to which the lesson will be added.
 *       schema:
 *         type: string
 *         format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *
 *   schemas:
 *     AddLessonToModuleRequest:
 *       type: object
 *       required:
 *         - title
 *         - duration
 *         - isPublished
 *         - lessonType
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the lesson.
 *           example: "Introduction to React Hooks"
 *         duration:
 *           type: number
 *           description: Duration of the lesson in minutes.
 *           minimum: 1
 *           example: 15
 *         isPublished:
 *           type: boolean
 *           description: Indicates whether the lesson is published.
 *           example: true
 *         lessonType:
 *           type: string
 *           enum: ["video", "text", "quiz"]
 *           description: Type of the lesson content.
 *           example: "video"
 *         content:
 *           type: string
 *           description: Optional lesson content (text or embedded HTML).
 *           example: "<p>Welcome to the course!</p>"
 */
export const addLessonToModuleSchema = z.object({
  params: z.object({
    moduleId: z
      .string({ required_error: 'Module ID is required.' })
      .uuid('Module ID must be a valid UUID'),
  }),
  body: z.object({
    title: z
      .string({ required_error: 'Title is required.' })
      .min(1, 'Title cannot be empty.'),
    duration: z
      .number({ invalid_type_error: 'Duration must be a number.' })
      .int('Duration must be an integer.')
      .min(1, 'Duration must be at least 1 minute.'),
    isPublished: z.boolean({
      invalid_type_error: 'isPublished must be a boolean value.',
      required_error: 'isPublished field is required.',
    }),
    lessonType: z.enum(['video', 'text', 'quiz'], {
      required_error: 'Lesson type is required.',
      invalid_type_error: 'Lesson type must be one of: video, text, or quiz.',
    }),
    content: z.string().optional(),
    // .nullable()
    //      .refine((val) => val == null || (typeof val === 'string' && val.trim().length > 0), {
    //   message: 'Content cannot be an empty string.',
    // }),
  }),
});

/**
 * @openapi
 * components:
 *   parameters:
 *     lessonId:
 *       name: lessonId
 *       in: path
 *       required: true
 *       description: Unique identifier of the lesson.
 *       schema:
 *         type: string
 *         format: uuid
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 */
export const lessonIdParamSchema = z.object({
  params: z.object({
    lessonId: z
      .string({ required_error: 'Lesson ID is required.' })
      .uuid('Lesson ID must be a valid UUID.'),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateLessonRequest:
 *       type: object
 *       description: Payload for updating a lesson's information.
 *       properties:
 *         title:
 *           type: string
 *           description: Optional new title for the lesson.
 *           example: "Advanced React Patterns"
 *         content:
 *           type: string
 *           description: Optional updated lesson content (text or HTML).
 *           example: "<p>Today we’ll learn about React render props...</p>"
 */
export const updateLessonZodSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title cannot be empty.').optional(),
    content: z.string().min(1, 'Content cannot be empty.').optional(),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     ReorderLessonsRequest:
 *       type: object
 *       required:
 *         - orderedLessonIds
 *       properties:
 *         orderedLessonIds:
 *           type: array
 *           description: Ordered list of lesson IDs representing their new sequence.
 *           items:
 *             type: string
 *             format: uuid
 *             example: "550e8400-e29b-41d4-a716-446655440000"
 *           example:
 *             - "550e8400-e29b-41d4-a716-446655440000"
 *             - "123e4567-e89b-12d3-a456-426614174000"
 *             - "9c9b9a98-7654-3210-fedc-ba9876543210"
 */
export const reorderLessonsSchema = z.object({
  body: z.object({
    ids: z
      .array(
        z
          .string({ required_error: 'Lesson ID is required.' })
          .uuid('Each lesson ID must be a valid UUID.')
      )
      .nonempty('At least one lesson ID must be provided.'),
  }),
});

/**
 * @openapi
 * components:
 *   parameters:
 *     lessonId:
 *       name: lessonId
 *       in: path
 *       required: true
 *       description: Unique identifier of the lesson for which the video upload URL is being requested.
 *       schema:
 *         type: string
 *         format: uuid
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 *
 *   schemas:
 *     VideoUploadUrlRequest:
 *       type: object
 *       required:
 *         - filename
 *       properties:
 *         filename:
 *           type: string
 *           description: Name of the video file to upload, including extension.
 *           example: "lesson-intro.mp4"
 */
export const videoUploadUrlSchema = z.object({
  params: z.object({
    lessonId: z
      .string({ required_error: 'Lesson ID is required.' })
      .uuid('Lesson ID must be a valid UUID.'),
  }),
  body: z.object({
    filename: z
      .string({ required_error: 'Filename is required.' })
      .min(1, 'Filename cannot be empty.'),
  }),
});
