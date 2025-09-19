import { z } from 'zod';

export const averageGradeResponseSchema = z.object({
  averageGrade: z.number().nullable(),
});

export type AverageGradeResponse = z.infer<typeof averageGradeResponseSchema>;
