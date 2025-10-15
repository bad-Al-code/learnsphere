import { z } from 'zod';
import { assignments, assignmentStatusEnum } from '../db/schema';

/**
 * @openapi
 * components:
 *   schemas:
 *     Assignment:
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
 *         moduleId:
 *           type: string
 *           format: uuid
 *         dueDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         status:
 *           type: string
 *           enum: [draft, published]
 *         order:
 *           type: integer
 *
 *     CreateAssignmentPayload:
 *       type: object
 *       required: [title]
 *       properties:
 *         title:
 *           type: string
 *           minLength: 3
 *           example: "Essay on Historical Perspectives"
 *         description:
 *           type: string
 *           example: "Write a 500-word essay on the major schools of thought."
 *         dueDate:
 *           type: string
 *           format: date-time
 *           example: "2025-07-15T23:59:59Z"
 *
 *     UpdateAssignmentPayload:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           minLength: 3
 *         description:
 *           type: string
 *         dueDate:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           enum: [draft, published]
 *
 *     FindAssignmentsQuery:
 *       type: object
 *       properties:
 *         courseId:
 *           type: string
 *           format: uuid
 *           description: UUID of the course to filter assignments
 *         q:
 *           type: string
 *           description: Search query to filter assignments by title
 *         status:
 *           type: string
 *           enum: [draft, published]
 *           description: Filter assignments by status
 *         moduleId:
 *           type: string
 *           format: uuid
 *           description: Filter assignments by module ID
 *         page:
 *           type: integer
 *           default: 1
 *           minimum: 1
 *           description: Page number for pagination
 *         limit:
 *           type: integer
 *           default: 10
 *           minimum: 1
 *           description: Number of assignments per page
 */
export const assignmentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().optional().nullable(),
  dueDate: z.coerce.date().optional().nullable(),
  status: z.enum(assignmentStatusEnum.enumValues).optional().default('draft'),
});

export type CreateAssignmentDto = z.infer<typeof assignmentSchema>;

export const updateAssignmentSchema = assignmentSchema.partial();
export type UpdateAssignmentDto = z.infer<typeof updateAssignmentSchema>;

export type Assignment = typeof assignments.$inferSelect;
export type NewAssignment = typeof assignments.$inferInsert;

export const findAssignmentsSchema = z.object({
  courseId: z.string().uuid(),
  q: z.string().optional(),
  status: z.enum(['draft', 'published']).optional(),
  moduleId: z.string().uuid().optional(),
  page: z
    .preprocess(
      (val) => (val ? parseInt(val as string, 10) : 1),
      z.number().int().positive()
    )
    .optional()
    .default(1),
  limit: z
    .preprocess(
      (val) => (val ? parseInt(val as string, 10) : 10),
      z.number().int().positive()
    )
    .optional()
    .default(5),
});

export type FindAssignmentsQuery = z.infer<typeof findAssignmentsSchema>;

/**
 * @openapi
 * components:
 *   schemas:
 *     FindPendingAssignmentsQuery:
 *       type: object
 *       properties:
 *         q:
 *           type: string
 *           description: Optional search query to filter assignments
 *         status:
 *           type: string
 *           enum: [not-started, in-progress]
 *           description: Optional filter by assignment status
 *       required: []
 */
export const findPendingAssignmentsSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    status: z.enum(['not-started', 'in-progress']).optional(),
  }),
});
export type FindPendingAssignmentsQuery = z.infer<typeof findAssignmentsSchema>;

/**
 * @openapi
 * components:
 *   schemas:
 *     AssignmentQuery:
 *       type: object
 *       properties:
 *         q:
 *           type: string
 *           description: Search query string
 *           minLength: 1
 *         status:
 *           type: string
 *           enum: [not-started, in-progress]
 *           description: Filter assignments by progress status
 *         type:
 *           type: string
 *           enum: [individual, collaborative]
 *           description: Filter assignments by type
 *       additionalProperties: false
 */
export const querySchema = z.object({
  q: z.string().trim().min(1).optional(),
  status: z.enum(['not-started', 'in-progress']).optional(),
  type: z.enum(['individual', 'collaborative']).optional(),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     AssignmentParams:
 *       type: object
 *       properties:
 *         assignmentId:
 *           type: string
 *           description: The unique identifier of the assignment
 *       required:
 *         - assignmentId
 *       additionalProperties: false
 */
export const assignmentParamsSchema = z.object({
  params: z.object({
    assignmentId: z.string().uuid('assignmentId must be a valid UUID'),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     DraftStatusesRequest:
 *       type: object
 *       properties:
 *         assignmentIds:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of assignment IDs to get draft statuses for
 *       required:
 *         - assignmentIds
 *       additionalProperties: false
 */
export const draftStatusesSchema = z.object({
  assignmentIds: z
    .array(z.string().min(1))
    .nonempty('assignmentIds cannot be empty'),
});

export const bulkAssignmentsSchema = z.object({
  body: z.object({
    assignmentIds: z
      .array(z.string().uuid())
      .nonempty('At least one assignment ID is required'),
  }),
});

export const bulkAssignmentsByCoursesSchema = z.object({
  body: z.object({
    courseIds: z
      .array(z.string().uuid())
      .nonempty('At least one course ID is required'),
  }),
});

export const submissionIdParamsSchema = z.object({
  params: z.object({
    submissionId: z.string().uuid('Invalid submission ID format'),
  }),
});

export const requestReGradeParamsSchema = z.object({
  params: z.object({
    submissionId: z.string().uuid('Invalid submission ID format'),
  }),
});
