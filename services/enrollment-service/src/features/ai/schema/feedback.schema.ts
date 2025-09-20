import { z } from 'zod';

export const feedbackResponseSchemaZod = z
  .array(
    z.object({
      title: z.string(),
      description: z.string(),
      level: z.enum(['high', 'medium', 'low']),
      actionButtonText: z.string(),
    })
  )
  .length(4, { message: 'AI must return exactly 4 insights' });

export type FeedbackResponseSchema = z.infer<typeof feedbackResponseSchemaZod>;
