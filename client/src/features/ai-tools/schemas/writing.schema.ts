import { z } from 'zod';

export const feedbackSchema = z.object({
  id: z.uuid(),
  assignmentId: z.uuid(),
  feedbackType: z.enum(['Grammar', 'Style', 'Clarity', 'Argument']),
  feedbackText: z.string(),
  createdAt: z.iso.datetime(),
});

export const writingAssignmentSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  courseId: z.uuid(),
  title: z.string(),
  prompt: z.string().nullable(),
  content: z.string().nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  feedback: z.array(feedbackSchema).optional(),
});

export type WritingAssignment = z.infer<typeof writingAssignmentSchema>;
export type WritingFeedback = z.infer<typeof feedbackSchema>;

export const createAssignmentInputSchema = z.object({
  courseId: z.uuid(),
  title: z.string().min(1, 'Title is required.'),
});
export type CreateAssignmentInput = z.infer<typeof createAssignmentInputSchema>;

export const updateAssignmentInputSchema = z.object({
  assignmentId: z.uuid(),
  title: z.string().min(1).optional(),
  content: z.string().optional(),
});
export type UpdateAssignmentInput = z.infer<typeof updateAssignmentInputSchema>;

export const generateDraftInputSchema = z.object({
  courseId: z.uuid(),
  title: z.string().min(1),
  prompt: z.string().min(10),
});
export type GenerateDraftInput = z.infer<typeof generateDraftInputSchema>;

export const getFeedbackInputSchema = z.object({
  assignmentId: z.uuid(),
  feedbackType: z.enum(['Grammar', 'Style', 'Clarity', 'Argument']),
});
export type GetFeedbackInput = z.infer<typeof getFeedbackInputSchema>;
