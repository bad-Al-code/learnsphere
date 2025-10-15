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

export const studyTimeTrendSchema = z.object({
  week: z.string(),
  studyHours: z.number(),
  target: z.number(),
});

export type StudyTimeTrend = z.infer<typeof studyTimeTrendSchema>;

export const ModuleStatusEnum = z.enum([
  'Completed',
  'In Progress',
  'Not Started',
]);
export type ModuleStatus = z.infer<typeof ModuleStatusEnum>;

export const moduleCompletionSchema = z.object({
  status: ModuleStatusEnum,
  value: z.number(),
  fill: z.string(),
});

export const moduleCompletionArraySchema = z.array(moduleCompletionSchema);
export type ModuleCompletionData = z.infer<typeof moduleCompletionArraySchema>;

export const aiProgressInsightSchema = z.object({
  title: z.string(),
  description: z.string(),
  highlighted: z.boolean().optional(),
});

export type AIProgressInsight = z.infer<typeof aiProgressInsightSchema>;

export const milestoneSchema = z.object({
  title: z.string(),
  date: z.string().datetime(),
  status: z.enum(['completed', 'in-progress', 'upcoming']),
  type: z.enum(['course', 'assignment', 'event']),
});

export type Milestone = z.infer<typeof milestoneSchema>;
