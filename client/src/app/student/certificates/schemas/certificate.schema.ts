import { z } from 'zod';

export const certificateSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  issuer: z.string(),
  issueDate: z.string(),
  expiryDate: z.string().nullable(),
  tags: z.array(z.string()),
  credentialId: z.string().nullable(),
  imageUrl: z.string().url().nullable(),
  description: z.string(),
  verificationUrl: z.string().url(),
  isFavorite: z.boolean(),
  isArchived: z.boolean(),
  notes: z.string().nullable(),
});

export type Certificate = z.infer<typeof certificateSchema>;

export const paginationSchema = z.object({
  currentPage: z.number(),
  totalPages: z.number(),
  totalResults: z.number(),
});

export type Pagination = z.infer<typeof paginationSchema>;

export const getCertificatesResponseSchema = z.object({
  results: z.array(certificateSchema),
  pagination: paginationSchema,
});

export type GetCertificatesResponse = z.infer<
  typeof getCertificatesResponseSchema
>;

export const sortByEnum = z.enum([
  'date-desc',
  'date-asc',
  'title-asc',
  'title-desc',
]);
export type SortOption = z.infer<typeof sortByEnum>;

export const filterEnum = z.enum(['favorites', 'archived']);
export type Filter = z.infer<typeof filterEnum>;

export const certificateFiltersSchema = z.object({
  q: z.string().optional(),
  tag: z.string().optional(),
  sortBy: sortByEnum.default('date-desc'),
  filter: filterEnum.optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).default(12),
});

export type CertificateFilters = z.infer<typeof certificateFiltersSchema>;

export const certificateParamsSchema = z.object({
  enrollmentId: z.string().uuid('Invalid enrollment ID format.'),
});

export const updateNotesSchema = z.object({
  notes: z.string(),
});

export const bulkOperationSchema = z.object({
  enrollmentIds: z.array(z.string().uuid()),
});

export type ViewMode = 'grid' | 'list';
export type GridColumns = 2 | 3 | 4;
