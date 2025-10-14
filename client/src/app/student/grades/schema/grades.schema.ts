import { z } from 'zod';

export const gradeSchema = z.object({
  id: z.uuid(),
  course: z.string(),
  assignment: z.string(),
  module: z.string(),
  grade: z.number().nullable(),
  status: z.enum(['Graded', 'Pending']),
  submitted: z.iso.datetime(),
});

export type Grade = z.infer<typeof gradeSchema>;

export const paginationSchema = z.object({
  currentPage: z.number(),
  totalPages: z.number(),
  totalResults: z.number(),
});

export const getMyGradesResponseSchema = z.object({
  results: z.array(gradeSchema),
  pagination: paginationSchema,
});

export type GetMyGradesResponse = z.infer<typeof getMyGradesResponseSchema>;

export const gradesFiltersSchema = z.object({
  q: z.string().optional(),
  courseId: z.string().optional(),
  grade: z.string().optional(),
  status: z.enum(['Graded', 'Pending']).optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).default(10),
});

export type GradesFilters = z.infer<typeof gradesFiltersSchema>;
