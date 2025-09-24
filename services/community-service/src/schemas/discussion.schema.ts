import { z } from 'zod';

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateDiscussionBody:
 *       type: object
 *       required:
 *         - name
 *         - courseId
 *         - content
 *       properties:
 *         name:
 *           type: string
 *           minLength: 5
 *           description: The title of the discussion.
 *         courseId:
 *           type: string
 *           format: uuid
 *           description: The ID of the course this discussion belongs to.
 *         assignmentId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: Optional assignment ID related to the discussion.
 *         content:
 *           type: string
 *           minLength: 10
 *           description: The content/body of the discussion.
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Optional tags for the discussion.
 */
export const createDiscussionSchema = z.object({
  body: z.object({
    name: z.string().min(5, 'Name must be at least 5 characters'),
    courseId: z.uuid(),
    assignmentId: z.uuid().optional(),
    content: z.string().min(10, 'Content must be at least 10 characters'),
    tags: z.array(z.string()).optional(),
  }),
});
export type CreateDiscussionDto = z.infer<
  typeof createDiscussionSchema
>['body'];

/**
 * @openapi
 * components:
 *   parameters:
 *     CourseIdParam:
 *       in: path
 *       name: courseId
 *       required: true
 *       schema:
 *         type: string
 *         format: uuid
 *       description: The ID of the course to fetch discussions for.
 */
export const courseDiscussionsParamsSchema = z.object({
  params: z.object({
    courseId: z.uuid(),
  }),
});
