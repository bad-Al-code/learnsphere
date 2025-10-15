import { z } from 'zod';

export const goalPrioritySchema = z.enum(['low', 'medium', 'high']);

export const goalTypeSchema = z.enum([
  'course_completion',
  'assignment_completion',
  'weekly_study_hours',
]);

export type GoalType = z.infer<typeof goalTypeSchema>;

export const goalSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  currentValue: z.number(),
  targetValue: z.number(),
  type: goalTypeSchema,
  targetDate: z.iso.datetime(),
  priority: goalPrioritySchema,
  isCompleted: z.boolean(),
});

export type Goal = z.infer<typeof goalSchema>;

export const createGoalSchema = z.object({
  title: z.string().min(3, 'Goal description must be at least 3 characters.'),
  type: goalTypeSchema,
  targetValue: z.coerce
    .number()
    .int()
    .positive('Target must be a positive number.'),
  targetDate: z.date({
    error: 'A deadline is required.',
  }),
  priority: goalPrioritySchema.default('medium'),
});

export type CreateGoalInput = z.infer<typeof createGoalSchema>;

export const updateGoalSchema = createGoalSchema.partial().extend({
  currentValue: z.coerce.number().int().min(0).optional(),
  isCompleted: z.boolean().optional(),
});

export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;
