import { z } from 'zod';

export const submissionDetailsSchema = z.object({
  id: z.uuid(),
  courseId: z.uuid(),
  assignmentId: z.uuid(),
  studentId: z.uuid(),
  grade: z.number().nullable(),
  gradedAt: z.iso.datetime(),
  submittedAt: z.iso.datetime(),
  content: z.string().nullable(),
});

export type SubmissionDetails = z.infer<typeof submissionDetailsSchema>;
