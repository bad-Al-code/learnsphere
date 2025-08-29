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

export const createAssignmentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().optional(),
  moduleId: z.uuid('You must select a module.'),
  dueDate: z.date().optional().nullable(),
  status: z.enum(['draft', 'published']).default('draft'),
});

export type CreateAssignmentFormValues = z.infer<typeof createAssignmentSchema>;

export const updateAssignmentSchema = createAssignmentSchema.partial();
export type UpdateAssignmentFormValues = z.infer<typeof updateAssignmentSchema>;
