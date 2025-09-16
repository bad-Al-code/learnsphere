import { z } from 'zod';

export const researchFindingSchema = z.object({
  id: z.string().uuid(),
  boardId: z.string().uuid(),
  title: z.string(),
  source: z.string().nullable(),
  url: z.string().url().nullable(),
  description: z.string().nullable(),
  aiSummary: z.string().nullable(),
  userNotes: z.string().nullable(),
  tags: z.array(z.string()).nullable(),
  relevance: z.number().int().nullable(),
  createdAt: z.string().datetime(),
});

export const researchBoardSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  courseId: z.string().uuid(),
  createdAt: z.string().datetime(),
  findings: z.array(researchFindingSchema),
});

export type ResearchFinding = z.infer<typeof researchFindingSchema>;
export type ResearchBoard = z.infer<typeof researchBoardSchema>;

export const tempFindingSchema = researchFindingSchema.omit({
  id: true,
  boardId: true,
  aiSummary: true,
  userNotes: true,
  createdAt: true,
});
export type TempFinding = z.infer<typeof tempFindingSchema>;

export const performResearchInputSchema = z.object({
  courseId: z.string().uuid(),
  query: z.string().min(3),
});
export type PerformResearchInput = z.infer<typeof performResearchInputSchema>;

export const saveFindingInputSchema = z.object({
  courseId: z.string().uuid(),
  finding: tempFindingSchema,
});
export type SaveFindingInput = z.infer<typeof saveFindingInputSchema>;

export const updateFindingNotesInputSchema = z.object({
  findingId: z.string().uuid(),
  userNotes: z.string(),
});
export type UpdateFindingNotesInput = z.infer<
  typeof updateFindingNotesInputSchema
>;
