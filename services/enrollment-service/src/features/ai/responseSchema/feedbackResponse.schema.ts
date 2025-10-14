import { Type } from '@google/genai';

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
