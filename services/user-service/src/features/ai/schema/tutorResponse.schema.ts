import { Type } from '@google/genai';

export const tutorResponseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      answer: {
        type: Type.STRING,
      },
    },
  },
};
