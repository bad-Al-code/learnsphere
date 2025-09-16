import { Type } from '@google/genai';

export const researchResponseSchema = {
  type: Type.OBJECT,
  properties: {
    findings: {
      type: Type.ARRAY,

      items: {
        type: Type.OBJECT,

        properties: {
          title: { type: Type.STRING },
          source: { type: Type.STRING },
          url: { type: Type.STRING },
          description: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          relevance: { type: Type.NUMBER },
        },

        required: [
          'title',
          'source',
          'url',
          'description',
          'tags',
          'relevance',
        ],
      },
    },
  },

  required: ['findings'],
};
