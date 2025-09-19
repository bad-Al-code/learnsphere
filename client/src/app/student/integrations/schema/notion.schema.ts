import { z } from 'zod';

export const exportToNotionInputSchema = z.object({
  courseId: z.uuid(),
});

export type ExportToNotionInput = z.infer<typeof exportToNotionInputSchema>;

export const exportToNotionResponseSchema = z.object({
  pageUrl: z.url(),
});

export type ExportToNotionResponse = z.infer<
  typeof exportToNotionResponseSchema
>;
