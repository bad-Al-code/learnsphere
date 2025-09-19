import { z } from 'zod';

export const averageGradeResponseSchema = z.object({
  averageGrade: z.number().nullable(),
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
