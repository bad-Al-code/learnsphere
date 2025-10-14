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
