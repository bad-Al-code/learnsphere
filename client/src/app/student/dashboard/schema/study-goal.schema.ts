import { z } from 'zod';

export const studyGoalSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  priority: z.enum(['low', 'medium', 'high']),
  currentValue: z.number(),
  targetValue: z.number(),
  targetDate: z.string(),
});

export const studyGoalsResponseSchema = z.array(studyGoalSchema);

export type StudyGoal = z.infer<typeof studyGoalSchema>;
