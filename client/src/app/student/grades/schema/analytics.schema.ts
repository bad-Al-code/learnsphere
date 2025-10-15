import { z } from 'zod';

export const predictiveChartItemSchema = z.object({
  month: z.string(),
  predicted: z.number(),
  confidence: z.number(),
});

export type PredictiveChartData = z.infer<typeof predictiveChartItemSchema>[];

export const performancePredictionItemSchema = z.object({
  title: z.string(),
  description: z.string(),
  highlighted: z.boolean().optional(),
});
export type PerformancePrediction = z.infer<
  typeof performancePredictionItemSchema
>;

export const learningRecommendationItemSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export type LearningRecommendation = z.infer<
  typeof learningRecommendationItemSchema
>;
