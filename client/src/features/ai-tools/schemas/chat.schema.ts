import { z } from 'zod';

export const tutorChatRequestSchema = z.object({
  courseId: z.uuid(),
  prompt: z.string().min(1, 'Message cannot be empty.'),
});
export type TutorChatRequest = z.infer<typeof tutorChatRequestSchema>;

export const tutorChatResponseSchema = z.object({
  response: z.string(),
});
export type TutorChatResponse = z.infer<typeof tutorChatResponseSchema>;
