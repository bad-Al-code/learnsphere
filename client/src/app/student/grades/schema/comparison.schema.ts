import { z } from 'zod';

export const performanceChartItemSchema = z.object({
  subject: z.string(),
  yourScore: z.number(),
  classAverage: z.number(),
});

export const topStudentSchema = z.object({
  rank: z.number(),
  name: z.string(),
  score: z.number(),
});

export const classRankingSchema = z.object({
  rank: z.number().nullable(),
  totalStudents: z.number(),
  topStudents: z.array(topStudentSchema),
});

export const performanceHighlightSchema = z.object({
  title: z.string(),
  description: z.string(),
  level: z.enum(['high', 'medium', 'low']),
  actionButtonText: z.string(),
});

export type PerformanceHighlight = z.infer<typeof performanceHighlightSchema>;

export const comparisonAnalyticsSchema = z.object({
  performanceChart: z.array(performanceChartItemSchema),
  classRanking: classRankingSchema,
});

export type ComparisonAnalyticsData = z.infer<typeof comparisonAnalyticsSchema>;

export const performancePredictionSchema = z.object({
  title: z.string(),
  description: z.string(),
  highlighted: z.boolean().optional(),
});

export type PerformancePrediction = z.infer<typeof performancePredictionSchema>;
