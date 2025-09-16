import { z } from 'zod';

export const noteInsightSchema = z.object({
  keyConcepts: z.array(z.string()).optional(),
  studyActions: z.array(z.string()).optional(),
  knowledgeGaps: z.array(z.string()).optional(),
});

export const userNoteSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  courseId: z.uuid(),
  title: z.string(),
  content: z.string().nullable(),
  insights: noteInsightSchema.nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type UserNote = z.infer<typeof userNoteSchema>;
export type NoteInsights = z.infer<typeof noteInsightSchema>;

export const createNoteInputSchema = z.object({
  courseId: z.uuid(),
  title: z.string().min(1, 'Title is required.'),
  content: z.string().optional(),
});

export type CreateNoteInput = z.infer<typeof createNoteInputSchema>;

export const updateNoteInputSchema = z.object({
  noteId: z.uuid(),
  title: z.string().min(1).optional(),
  content: z.string().optional(),
});

export type UpdateNoteInput = z.infer<typeof updateNoteInputSchema>;
