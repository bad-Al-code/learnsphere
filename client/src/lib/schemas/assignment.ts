import { z } from 'zod';

export const findAssignmentsSchema = z.object({
  courseId: z.uuid(),
  q: z.string().optional(),
  status: z.enum(['draft', 'published']).optional(),
  moduleId: z.string().uuid().optional(),
  page: z
    .preprocess(
      (val) => (val ? parseInt(val as string, 10) : 1),
      z.number().int().positive()
    )
    .optional()
    .default(1),
  limit: z
    .preprocess(
      (val) => (val ? parseInt(val as string, 10) : 10),
      z.number().int().positive()
    )
    .optional()
    .default(5),
});

export type FindAssignmentsQuery = z.infer<typeof findAssignmentsSchema>;
