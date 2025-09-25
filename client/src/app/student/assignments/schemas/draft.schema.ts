import { z } from 'zod';

export const draftSchema = z.object({
  id: z.uuid(),
  assignmentId: z.uuid(),
  title: z.string(),
  course: z.string(),
  progress: z.number().default(0),
  lastSaved: z.iso.datetime(),
  wordCount: z.number(),
  status: z.enum(['draft', 'reviewing', 'completed']),
  aiSuggestions: z.number().nullable().optional(),
  collaborators: z.array(z.string()).nullable().optional(),
  dueDate: z.iso.datetime().nullable().optional(),
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
  tags: z.array(z.string()).nullable().optional(),
});
export type Discussion = z.infer<typeof discussionSchema>;

export const aiSuggestionSchema = z.object({
  type: z.enum(['grammar', 'content', 'structure', 'research']),
  suggestion: z.string(),
  confidence: z.number(),
});

export const aiSuggestionsResponseSchema = z.object({
  suggestions: z.array(aiSuggestionSchema),
});
export type AISuggestion = z.infer<typeof aiSuggestionSchema>;
export type AISuggestionResponse = z.infer<typeof aiSuggestionsResponseSchema>;

export const createDraftInputSchema = z.object({
  title: z.string().min(3, 'Title is required.'),
  assignmentId: z.uuid('You must select a parent assignment.'),
});
export type CreateDraftInput = z.infer<typeof createDraftInputSchema>;

export const updateDraftContentInputSchema = z.object({
  content: z.string().optional(),
  wordCount: z.number().int().nonnegative().optional(),
});
export type UpdateDraftContentInput = z.infer<
  typeof updateDraftContentInputSchema
>;

export const addCollaboratorInputSchema = z.object({
  email: z.email('Please enter a valid email.'),
});
export type AddCollaboratorInput = z.infer<typeof addCollaboratorInputSchema>;

export const createDiscussionInputSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  courseId: z.uuid('You must select a valid course.'),
  content: z.string().min(10, 'Your message is too short.'),
  tags: z.string().optional(),
});
export type CreateDiscussionInput = z.infer<typeof createDiscussionInputSchema>;

export const postReplyInputSchema = z.object({
  content: z.string().min(1, "Reply can't be empty."),
});
export type PostReplyInput = z.infer<typeof postReplyInputSchema>;

export const draftParamsSchema = z.object({
  draftId: z.uuid(),
});
export const discussionParamsSchema = z.object({
  discussionId: z.uuid(),
});
