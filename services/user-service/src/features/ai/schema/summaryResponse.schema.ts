import { Type } from '@google/genai';

export const summaryResponseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
  },

  required: ['summary'],
};
