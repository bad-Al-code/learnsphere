import { z } from 'zod';

export const certificateSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  issuer: z.string(),
  issueDate: z.iso.datetime(),
  expiryDate: z.iso.datetime().nullable(),
  tags: z.array(z.string()),
  credentialId: z.string().nullable(),
  imageUrl: z.url().nullable(),
  description: z.string(),
  verificationUrl: z.url(),
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

export const getCertificatesResponseSchema = z.object({
  results: z.array(certificateSchema),
  pagination: paginationSchema,
});

export type GetCertificatesResponse = z.infer<
  typeof getCertificatesResponseSchema
>;

export const SortyByEnum = z.enum([
  'date-desc',
  'date-asc',
  'title-asc',
  'title-desc',
]);
export type SortOption = z.infer<typeof SortyByEnum>;

export const FilterEnum = z.enum(['favorites', 'archived']);
export type Filter = z.infer<typeof FilterEnum>;

export const certificateFiltersSchema = z.object({
  q: z.string().optional(),
  tag: z.string().optional(),
  sortBy: SortyByEnum.default('date-desc'),
  filter: FilterEnum.optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).default(12),
});

export type CertificateFilters = z.infer<typeof certificateFiltersSchema>;

export const certificateParamsSchema = z.object({
  enrollmentId: z.string().uuid('Invalid enrollment ID format.'),
});
