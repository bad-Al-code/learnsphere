import { z } from 'zod';

export const aiFeedbackSchema = z.object({
  id: z.uuid(),
  submissionId: z.uuid(),
  studentId: z.uuid(),
  score: z.number(),
  summary: z.string(),
  suggestions: z.array(z.string()),
  detailedFeedback: z.string().nullable(),
  status: z.enum(['reviewed', 'pending']),
  reviewedAt: z.iso.datetime(),
});

export const reGradeResponseSchema = z.object({
  message: z.string(),
});

export type AIFeedback = z.infer<typeof aiFeedbackSchema>;
export type ReGradeResponse = z.infer<typeof reGradeResponseSchema>;
