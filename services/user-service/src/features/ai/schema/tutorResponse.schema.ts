import { Type } from '@google/genai';

export const tutorResponseSchema = {
  type: Type.OBJECT,
  properties: {
    answer: {
      type: Type.STRING,
    },
  },
};
