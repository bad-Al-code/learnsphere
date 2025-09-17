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

/**
 * @openapi
 * components:
 *   schemas:
 *     AssignmentIdParam:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the assignment.
 */
export const assignmentIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('A valid assignment ID is required.'),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateAssignmentRequest:
 *       type: object
 *       description: Schema for updating an assignment. At least one field must be provided.
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *           description: Updated title of the assignment.
 *         content:
 *           type: string
 *           description: Updated content/body of the assignment.
 *         prompt:
 *           type: string
 *           description: Updated writing prompt for the assignment.
 *       example:
 *         title: "Updated Assignment Title"
 *         content: "Revised assignment content..."
 *         prompt: "New prompt for the assignment"
 */
export const updateAssignmentSchema = z.object({
  body: z
    .object({
      title: z.string().min(1).max(255).optional(),
      content: z.string().optional(),
      prompt: z.string().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message:
        'At least one field (title, content, or prompt) must be provided for an update.',
    }),
});
