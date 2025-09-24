import { z } from 'zod';

export const draftSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  course: z.string(),
  progress: z.number(),
  lastSaved: z.iso.datetime(),
  wordCount: z.number(),
  status: z.enum(['draft', 'reviewing', 'completed']),
  aiSuggestions: z.number().optional().nullable(),
  collaborators: z.array(z.string()).optional().nullable(),
  dueDate: z.iso.datetime().optional().nullable(),
  priority: z.enum(['low', 'medium', 'high']),
  category: z.string().nullable(),
});
export type Draft = z.infer<typeof draftSchema>;

export const discussionSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  course: z.string(),
  author: z.string(),
  replies: z.number(),
  lastReply: z.string(),
  isResolved: z.boolean(),
  isBookmarked: z.boolean().optional(),
  views: z.number().optional(),
  tags: z.array(z.string()).optional().nullable(),
});
export type Discussion = z.infer<typeof discussionSchema>;
