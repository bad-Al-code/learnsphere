import { z } from 'zod';
import { studyGoalPriorityEnum, studyGoalTypeEnum } from '../db/schema';

export const studyGoalQuerySchema = z.object({
  query: z.object({
    userId: z.string().min(1, 'userId is required').uuid(),
    type: z.enum(studyGoalTypeEnum.enumValues),
  }),
});

export type UserQuerySchema = z.infer<typeof studyGoalQuerySchema>['query'];

/**
 * @openapi
 * components:
 *   schemas:
 *     StudyGoal:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         type:
 *           type: string
 *           enum: [course_completion, assignment_completion, weekly_study_hours]
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *         targetValue:
 *           type: integer
 *         currentValue:
 *           type: integer
 *         targetDate:
 *           type: string
 *           format: date
 *         isCompleted:
 *           type: boolean
 *     CreateStudyGoalPayload:
 *       type: object
 *       required:
 *         - title
 *         - type
 *         - targetValue
 *         - targetDate
 *       properties:
 *         title:
 *           type: string
 *           description: "Title of the goal."
 *           example: "Master React Hooks"
 *         type:
 *           type: string
 *           enum: [course_completion, assignment_completion, weekly_study_hours]
 *           description: "The type of goal being set."
 *           example: "weekly_study_hours"
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *           description: "Priority of the goal."
 *           default: "medium"
 *         targetValue:
 *           type: integer
 *           description: "The target value for the goal (e.g., 20 for 20 hours)."
 *           example: 20
 *         targetDate:
 *           type: string
 *           format: date-time
 *           description: "The deadline for the goal."
 *           example: "2025-12-31T23:59:59Z"
 */
export const createStudyGoalSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters long.'),
    type: z.enum(studyGoalTypeEnum.enumValues),
    priority: z.enum(studyGoalPriorityEnum.enumValues).default('medium'),
    targetValue: z.coerce
      .number()
      .int()
      .positive('Target must be a positive number.'),
    targetDate: z.string().datetime({ message: 'Invalid date format.' }),
  }),
});

export type CreateStudyGoalInput = z.infer<
  typeof createStudyGoalSchema
>['body'];

export const goalIdParamsSchema = z.object({
  params: z.object({
    goalId: z.string().uuid('Invalid goal ID format.'),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateStudyGoalPayload:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           minLength: 3
 *         currentValue:
 *           type: integer
 *           minimum: 0
 *         isCompleted:
 *           type: boolean
 *         priority:
 *           type: string
 *           enum: [low, medium, high]
 *         targetDate:
 *           type: string
 *           format: date-time
 */
export const updateStudyGoalSchema = z.object({
  body: createStudyGoalSchema.shape.body.partial().extend({
    currentValue: z.coerce.number().int().min(0).optional(),
    isCompleted: z.boolean().optional(),
  }),
});

export type UpdateStudyGoalInput = z.infer<
  typeof updateStudyGoalSchema
>['body'];
