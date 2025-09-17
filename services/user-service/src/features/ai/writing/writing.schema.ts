import { z } from 'zod';

/**
 * @openapi
 * components:
 *   schemas:
 *     GetAssignmentsQuery:
 *       type: object
 *       required:
 *         - courseId
 *       properties:
 *         courseId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the course to fetch assignments for.
 */
export const getAssignmentsQuerySchema = z.object({
  query: z.object({
    courseId: z.string().uuid('A valid courseId is required.'),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateAssignmentRequest:
 *       type: object
 *       required:
 *         - courseId
 *         - title
 *       properties:
 *         courseId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the course this assignment belongs to.
 *         title:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *           description: Title of the assignment.
 *         prompt:
 *           type: string
 *           nullable: true
 *           description: Optional prompt or question associated with the assignment.
 *         content:
 *           type: string
 *           nullable: true
 *           description: Optional content or instructions for the assignment.
 */
export const createAssignmentSchema = z.object({
  body: z.object({
    courseId: z.string().uuid('A valid courseId is required.'),
    title: z.string().min(1, 'Title is required.').max(255),
    prompt: z.string().optional(),
    content: z.string().optional(),
  }),
});
