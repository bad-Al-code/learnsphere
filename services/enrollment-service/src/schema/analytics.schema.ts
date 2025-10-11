import { z } from 'zod';

export const courseIdParamsSchema = z.object({
  params: z.object({
    courseId: z.string().uuid('Invalid course ID format'),
  }),
});
