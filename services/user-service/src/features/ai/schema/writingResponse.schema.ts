import { Type } from '@google/genai';

export const draftResponseSchema = {
  type: Type.OBJECT,
  properties: {
    draftContent: { type: Type.STRING },
  },

  required: ['draftContent'],
};

export const feedbackResponseSchema = {
  type: Type.OBJECT,
  properties: {
    suggestions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          originalText: { type: Type.STRING },
          suggestion: { type: Type.STRING },
          explanation: { type: Type.STRING },
        },

        required: ['originalText', 'suggestion', 'explanation'],
      },
    },
  },

  required: ['suggestions'],
};
