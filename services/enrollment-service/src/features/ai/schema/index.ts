import { Type } from '@google/genai';
import { z } from 'zod';

export const performanceHighlightItemSchema = z.object({
  title: z.string(),
  text: z.string(),
});

export const performanceHighlightsResponseSchema = {
  type: Type.OBJECT,
  properties: {
    highlights: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          text: { type: Type.STRING },
        },
        required: ['title', 'text'],
      },
    },
  },
  required: ['highlights'],
};

export const performanceHighlightsZodSchema = z.object({
  highlights: z.array(performanceHighlightItemSchema).length(3),
});

export type PerformanceHighlights = z.infer<
  typeof performanceHighlightsZodSchema
>['highlights'];

export const predictiveChartItemSchema = z.object({
  month: z.string(),
  predicted: z.number(),
  confidence: z.number(),
});

export const predictiveChartDataSchema = z.array(predictiveChartItemSchema);

export const predictiveChartResponseSchema = {
  type: Type.OBJECT,
  properties: {
    predictions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          month: { type: Type.STRING },
          predicted: { type: Type.NUMBER },
          confidence: { type: Type.NUMBER },
        },
        required: ['month', 'predicted', 'confidence'],
      },
    },
  },
  required: ['predictions'],
};

export type PredictiveChartData = z.infer<typeof predictiveChartDataSchema>;

export const performancePredictionItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  highlighted: z.boolean().optional(),
});

export const performancePredictionSchema = z.array(
  performancePredictionItemSchema
);

export const performancePredictionResponseSchema = {
  type: Type.OBJECT,
  properties: {
    predictions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          highlighted: { type: Type.BOOLEAN },
        },
        required: ['title', 'description'],
      },
    },
  },
  required: ['predictions'],
};

export type PerformancePrediction = z.infer<
  typeof performancePredictionItemSchema
>;

export const learningRecommendationItemSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export const learningRecommendationSchema = z.array(
  learningRecommendationItemSchema
);

export const learningRecommendationResponseSchema = {
  type: Type.OBJECT,
  properties: {
    recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ['title', 'description'],
      },
    },
  },
  required: ['recommendations'],
};

export type LearningRecommendation = z.infer<
  typeof learningRecommendationItemSchema
>;

export const aiProgressInsightSchema = z.object({
  title: z.string(),
  description: z.string(),
  highlighted: z.boolean().optional(),
});

export const aiProgressInsightsResponseSchema = {
  type: Type.OBJECT,
  properties: {
    insights: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          highlighted: { type: Type.BOOLEAN },
        },
        required: ['title', 'description'],
      },
    },
  },
  required: ['insights'],
};

export const aiProgressInsightArraySchema = z.array(aiProgressInsightSchema);
export type AIProgressInsight = z.infer<typeof aiProgressInsightSchema>;

export const learningEfficiencyItemSchema = z.object({
  subject: z.string(),
  comprehension: z.number().int().min(0).max(100),
  retention: z.number().int().min(0).max(100),
  application: z.number().int().min(0).max(100),
});

export const learningEfficiencySchema = z.array(learningEfficiencyItemSchema);

export const learningEfficiencyResponseSchema = {
  type: Type.OBJECT,
  properties: {
    efficiency: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          subject: { type: Type.STRING },
          comprehension: { type: Type.NUMBER },
          retention: { type: Type.NUMBER },
          application: { type: Type.NUMBER },
        },
        required: ['subject', 'comprehension', 'retention', 'application'],
      },
    },
  },
  required: ['efficiency'],
};

export type LearningEfficiency = z.infer<typeof learningEfficiencyItemSchema>;

export const studyHabitItemSchema = z.object({
  day: z.string(),
  efficiency: z.number().int().min(0).max(100),
  focus: z.number().int().min(0).max(100),
});

export const studyHabitsSchema = z.array(studyHabitItemSchema);

export const studyHabitsResponseSchema = {
  type: Type.OBJECT,
  properties: {
    habits: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.STRING },
          efficiency: { type: Type.NUMBER },
          focus: { type: Type.NUMBER },
        },
        required: ['day', 'efficiency', 'focus'],
      },
    },
  },
  required: ['habits'],
};
