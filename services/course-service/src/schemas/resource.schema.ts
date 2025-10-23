import { z } from 'zod';
import { resources } from '../db/schema';

export type Resource = typeof resources.$inferSelect;
export type NewResource = typeof resources.$inferInsert;

/**
 * @openapi
 * components:
 *   schemas:
 *     Resource:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         courseId:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         fileUrl:
 *           type: string
 *           format: uri
 *         fileName:
 *           type: string
 *         fileSize:
 *           type: number
 *         fileType:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     CreateResourcePayload:
 *       type: object
 *       required: [title, fileUrl, fileName, fileSize, fileType]
 *       properties:
 *         title:
 *           type: string
 *           example: "Course Syllabus PDF"
 *         fileUrl:
 *           type: string
 *           format: uri
 *           example: "https://s3.amazonaws.com/..."
 *         fileName:
 *           type: string
 *           example: "syllabus.pdf"
 *         fileSize:
 *           type: integer
 *           example: 1024768
 *         fileType:
 *           type: string
 *           example: "application/pdf"
 *
 *     UpdateResourcePayload:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *
 *     UploadUrlPayload:
 *       type: object
 *       required: [filename]
 *       properties:
 *         filename:
 *           type: string
 *           example: "syllabus.pdf"
 */
export const createResourceSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  fileUrl: z.string().url(),
  fileName: z.string().min(1),
  fileSize: z.number().int().positive(),
  fileType: z.string().min(1),
  status: z.enum(['draft', 'published']).optional().default('draft'),
});

export const updateResourceSchema = createResourceSchema.partial();

export const uploadUrlSchema = z.object({
  filename: z.string().min(1, 'Filename is required.'),
});

export type CreateResourceDto = z.infer<typeof createResourceSchema>;
export type UpdateResourceDto = z.infer<typeof updateResourceSchema>;
export type UploadUrlDto = z.infer<typeof uploadUrlSchema>;

/**
 * @openapi
 * components:
 *   parameters:
 *     courseId:
 *       name: courseId
 *       in: path
 *       required: true
 *       description: Unique identifier of the course for which to fetch resources.
 *       schema:
 *         type: string
 *         format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     page:
 *       name: page
 *       in: query
 *       required: false
 *       description: Page number for pagination (default is 1).
 *       schema:
 *         type: integer
 *         minimum: 1
 *         default: 1
 *         example: 1
 *     limit:
 *       name: limit
 *       in: query
 *       required: false
 *       description: Number of resources per page (fixed at 6).
 *       schema:
 *         type: integer
 *         default: 6
 *         example: 6
 */
export const getResourcesForCourseSchema = z.object({
  params: z.object({
    courseId: z
      .string({ required_error: 'Course ID is required.' })
      .uuid('Course ID must be a valid UUID.'),
  }),
  query: z.object({
    page: z.coerce
      .number({ invalid_type_error: 'Page must be a number.' })
      .int('Page must be an integer.')
      .min(1, 'Page must be at least 1.')
      .default(1),
    limit: z.number().int().min(1).default(6),
  }),
});

/**
 * @openapi
 * components:
 *   parameters:
 *     resourceId:
 *       name: resourceId
 *       in: path
 *       required: true
 *       description: Unique identifier of the resource.
 *       schema:
 *         type: string
 *         format: uuid
 *         example: "550e8400-e29b-41d4-a716-446655440000"
 */
export const resourceIdParamSchema = z.object({
  params: z.object({
    resourceId: z
      .string({ required_error: 'Resource ID is required.' })
      .uuid('Resource ID must be a valid UUID.'),
  }),
});

/**
 * @openapi
 * components:
 *   parameters:
 *     courseId:
 *       name: courseId
 *       in: path
 *       required: true
 *       description: Unique identifier of the course for which the upload URL is requested.
 *       schema:
 *         type: string
 *         format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *
 *   schemas:
 *     GetUploadUrlRequest:
 *       type: object
 *       required:
 *         - filename
 *       properties:
 *         filename:
 *           type: string
 *           description: Name of the file to be uploaded.
 *           example: "lecture1.mp4"
 */
export const getUploadUrlSchema = z.object({
  params: z.object({
    courseId: z
      .string({ required_error: 'Course ID is required.' })
      .uuid('Course ID must be a valid UUID.'),
  }),
  body: z.object({
    filename: z
      .string({ required_error: 'Filename is required.' })
      .min(1, 'Filename cannot be empty.'),
  }),
});
