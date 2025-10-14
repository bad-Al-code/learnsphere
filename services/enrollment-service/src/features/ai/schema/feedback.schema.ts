import { Type } from '@google/genai';
import { z } from 'zod';

export const feedbackResponseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      level: { type: Type.STRING, enum: ['high', 'medium', 'low'] },
      actionButtonText: { type: Type.STRING },
    },
    required: ['title', 'description', 'level', 'actionButtonText'],
  },
};

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
