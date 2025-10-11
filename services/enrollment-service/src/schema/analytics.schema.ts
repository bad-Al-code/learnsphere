import { z } from 'zod';

export const courseIdParamsSchema = z.object({
  params: z.object({
    courseId: z.string().uuid('Invalid course ID format'),
  }),
});

export const statCardSchema = z.object({
  title: z.string(),
  value: z.string(),
  change: z.string().optional(),
  description: z.string().optional(),
  Icon: z.string(),
});

export const trendDataSchema = z.object({
  month: z.string(),
  submissions: z.number(),
  grade: z.number(),
});

export const gradeDistributionSchema = z.object({
  grade: z.string(),
  value: z.number(),
  fill: z.string(),
});

export const performanceInsightSchema = z.object({
  title: z.string(),
  text: z.string(),
  Icon: z.string(),
  color: z.string(),
});

export const assignmentAnalyticsSchema = z.object({
  stats: z.array(statCardSchema),
  trends: z.array(trendDataSchema),
  gradeDistribution: z.array(gradeDistributionSchema),
  insights: z.array(performanceInsightSchema),
});

export type AssignmentAnalytics = z.infer<typeof assignmentAnalyticsSchema>;
