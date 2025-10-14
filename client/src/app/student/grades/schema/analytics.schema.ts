import { z } from 'zod';

export const predictiveChartItemSchema = z.object({
  month: z.string(),
  predicted: z.number(),
  confidence: z.number(),
});

export type PredictiveChartData = z.infer<typeof predictiveChartItemSchema>[];
