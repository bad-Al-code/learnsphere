import { Type } from '@google/genai';

export const flashcardResponseSchema = {
  type: Type.OBJECT,

  properties: {
    flashcards: {
      type: Type.ARRAY,

      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING },
          answer: { type: Type.STRING },
        },

        required: ['question', 'answer'],
      },
    },
  },

  required: ['flashcards'],
};
