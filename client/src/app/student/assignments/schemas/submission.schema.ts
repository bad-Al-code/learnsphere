import { z } from 'zod';

export const submittedAssignmentSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  course: z.string(),
  submittedDate: z.iso.datetime(),
  status: z.enum(['Graded', 'Pending Review']),
  similarity: z.number().nullable().optional(),
  peerReviews: z.number(),
  peerAvg: z.number(),
  score: z.number().nullable(),
  points: z.string(),
  feedback: z.string().nullable().optional(),
  rubric: z
    .array(
      z.object({
        criteria: z.string(),
        score: z.number(),
        maxScore: z.number(),
        comment: z.string(),
      })
    )
    .nullable()
    .optional(),
});
export type SubmittedAssignment = z.infer<typeof submittedAssignmentSchema>;

export const aiFeedbackSchema = z.object({
  id: z.uuid(),
  submissionId: z.uuid(),
  score: z.number(),
  summary: z.string(),
  suggestions: z.array(z.string()),
  detailedFeedback: z.string().nullable(),
  status: z.enum(['reviewed', 'pending']),
  reviewedDate: z.iso.datetime(),
});
export type AIFeedback = z.infer<typeof aiFeedbackSchema>;
export type EnrichedAIFeedback = AIFeedback & { title: string };
