import { Type } from '@google/genai';
import { z } from 'zod';

export const assignmentFeedbackResponseSchema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.INTEGER },
    summary: { type: Type.STRING },
    detailedFeedback: { type: Type.STRING },
    suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
  },

  required: ['score', 'summary', 'detailedFeedback', 'suggestions'],
};

export const assignmentFeedbackZodSchema = z.object({
  score: z.number().int().min(0).max(100),
  summary: z.string().min(1),
  detailedFeedback: z.string().min(1),
  suggestions: z.array(z.string()).min(1),
});
export type AssignmentFeedback = z.infer<typeof assignmentFeedbackZodSchema>;
