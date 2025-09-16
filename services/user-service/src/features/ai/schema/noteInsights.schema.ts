import { Type } from '@google/genai';

export const noteAnalysisResponseSchema = {
  type: Type.OBJECT,
  properties: {
    keyConcepts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },

    studyActions: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },

    knowledgeGaps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },

  required: ['keyConcepts', 'studyActions', 'knowledgeGaps'],
};
