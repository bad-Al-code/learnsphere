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
