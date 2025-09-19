import { z } from 'zod';

export const averageGradeResponseSchema = z.object({
  averageGrade: z.number().nullable(),
  change: z.number(),
});
export type AverageGradeResponse = z.infer<typeof averageGradeResponseSchema>;

export const dueSoonResponseSchema = z.object({
  count: z.number(),
});
export type DueSoonResponse = z.infer<typeof dueSoonResponseSchema>;

export const studyStreakResponseSchema = z.object({
  streak: z.number(),
});
export type StudyStreakResponse = z.infer<typeof studyStreakResponseSchema>;

export const pendingAssignmentsResponseSchema = z.object({
  count: z.number(),
});
export type PendingAssignmentsResponse = z.infer<
  typeof pendingAssignmentsResponseSchema
>;
