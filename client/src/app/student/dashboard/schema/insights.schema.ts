import { z } from 'zod';

export const studyTimeDataPointSchema = z.object({
  day: z.string(),
  hours: z.number(),
});
export type StudyTimeDataPoint = z.infer<typeof studyTimeDataPointSchema>;

export const studyTimeTrendResponseSchema = z.array(studyTimeDataPointSchema);

export const aiInsightSchema = z.object({
  title: z.string(),
  description: z.string(),
  level: z.enum(['high', 'medium', 'low']),
  actionButtonText: z.string(),
});

export const aiInsightsResponseSchema = z.array(aiInsightSchema);
export type AIInsight = z.infer<typeof aiInsightSchema>;
