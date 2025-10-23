import { z } from 'zod';

/**
 * @openapi
 * components:
 *   parameters:
 *     courseId:
 *       name: courseId
 *       in: path
 *       required: true
 *       description: Unique identifier of the course to which the module will be added.
 *       schema:
 *         type: string
 *         format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *
 *   schemas:
 *     AddModuleToCourseRequest:
 *       type: object
 *       required:
 *         - title
 *         - isPublished
 *       properties:
 *         title:
 *           type: string
 *           description: Title of the new module.
 *           example: "Introduction to React"
 *         isPublished:
 *           type: boolean
 *           description: Whether the module is published.
 *           example: true
 */
export const addModuleToCourseSchema = z.object({
  params: z.object({
    courseId: z
      .string({ required_error: 'Course ID is required.' })
      .uuid('Course ID must be a valid UUID.'),
  }),
  body: z.object({
    title: z
      .string({ required_error: 'Module title is required.' })
      .min(1, 'Title cannot be empty.'),
    isPublished: z.boolean({
      required_error: 'isPublished field is required.',
      invalid_type_error: 'isPublished must be a boolean.',
    }),
  }),
});

/**
 * @openapi
 * components:
 *   parameters:
 *     moduleId:
 *       name: moduleId
 *       in: path
 *       required: true
 *       description: Unique identifier of the module to update.
 *       schema:
 *         type: string
 *         format: uuid
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *
 *   schemas:
 *     UpdateModuleRequest:
 *       type: object
 *       description: Payload to update module properties.
 *       properties:
 *         title:
 *           type: string
 *           description: Optional new title of the module.
 *           example: "Updated Module Title"
 *         order:
 *           type: integer
 *           description: Optional new order position of the module.
 *           minimum: 1
 *           example: 2
 *         isPublished:
 *           type: boolean
 *           description: Optional flag indicating if the module is published.
 *           example: true
 */
export const updateModuleSchema = z.object({
  params: z.object({
    moduleId: z
      .string({ required_error: 'Module ID is required.' })
      .uuid('Module ID must be a valid UUID.'),
  }),
  body: z.object({
    title: z.string().min(1, 'Title cannot be empty.').optional(),
    order: z
      .number({ invalid_type_error: 'Order must be a number.' })
      .int('Order must be an integer.')
      .min(1, 'Order must be at least 1.')
      .optional(),
    isPublished: z
      .boolean({ invalid_type_error: 'isPublished must be a boolean.' })
      .optional(),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     BulkModulesRequest:
 *       type: object
 *       required:
 *         - moduleIds
 *       properties:
 *         moduleIds:
 *           type: array
 *           description: List of module IDs to process in bulk.
 *           items:
 *             type: string
 *             format: uuid
 *             example: "123e4567-e89b-12d3-a456-426614174000"
 *           example:
 *             - "123e4567-e89b-12d3-a456-426614174000"
 *             - "550e8400-e29b-41d4-a716-446655440000"
 */
export const bulkModulesSchema = z.object({
  body: z.object({
    moduleIds: z
      .array(
        z
          .string({ required_error: 'Module ID is required.' })
          .uuid('Each module ID must be a valid UUID.')
      )
      .nonempty('At least one module ID is required.'),
  }),
});
