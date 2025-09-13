import { z } from 'zod';

export const tutorChatRequestSchema = z.object({
  courseId: z.uuid(),
  prompt: z.string().min(1, 'Message cannot be empty.'),
  conversationId: z.uuid().optional(),
});
export type TutorChatRequest = z.infer<typeof tutorChatRequestSchema>;

export const tutorChatResponseSchema = z.object({
  response: z.string(),
});
export type TutorChatResponse = z.infer<typeof tutorChatResponseSchema>;

export const conversationSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  courseId: z.uuid(),
  title: z.string(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
export type Conversation = z.infer<typeof conversationSchema>;

export const createConversationSchema = z.object({
  courseId: z.uuid(),
  title: z.string().min(1).optional(),
});
export type CreateConversationInput = z.infer<typeof createConversationSchema>;

export const renameConversationSchema = z.object({
  conversationId: z.uuid(),
  title: z.string().min(1, 'Title cannot be empty.').max(255),
});
export type RenameConversationInput = z.infer<typeof renameConversationSchema>;
