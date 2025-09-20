import { z } from 'zod';

export const feedbackResponseSchemaZod = z.array(
  z.object({
    title: z.string(),
    description: z.string(),
    level: z.string(),
    actionButtonText: z.string(),
  })
);
export type FeedbackResponseSchema = z.infer<typeof feedbackResponseSchemaZod>;
