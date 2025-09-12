import { z } from 'zod';

export const tutorChatSchema = z.object({
  body: z.object({
    courseId: z.string().uuid('Invalid course ID format.'),
    prompt: z.string().min(1, 'Prompt cannot be empty.').max(5000),
  }),
});
