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

export const aiDraftSuggestionResponseSchema = {
  type: Type.OBJECT,
  properties: {
    suggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          suggestion: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
        },
        required: ['type', 'suggestion', 'confidence'],
      },
    },
  },
  required: ['suggestions'],
};

export const aiDraftSuggestionZodSchema = z.object({
  suggestions: z.array(
    z.object({
      type: z.enum(['grammar', 'content', 'structure', 'research']),
      suggestion: z.string(),
      confidence: z.number().min(0).max(100),
    })
  ),
});
export type AIDraftSuggestionResponse = z.infer<
  typeof aiDraftSuggestionZodSchema
>;
