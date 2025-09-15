import { Type } from '@google/genai';

export const quizResponseSchema = {
  type: Type.OBJECT,
  properties: {
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          questionText: { type: Type.STRING },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          correctAnswerIndex: { type: Type.NUMBER },
        },
        required: ['questionText', 'options', 'correctAnswerIndex'],
      },
    },
  },
  required: ['questions'],
};
