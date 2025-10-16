import { z } from 'zod';

/**
 * @openapi
 * components:
 *   schemas:
 *     SortByEnum:
 *       type: string
 *       description: Sorting order for certificate results.
 *       enum: [date-desc, date-asc, title-asc, title-desc]
 */
export const SortByEnum = z.enum([
  'date-desc',
  'date-asc',
  'title-asc',
  'title-desc',
]);
export type SortBy = z.infer<typeof SortByEnum>;

/**
 * @openapi
 * components:
 *   schemas:
 *     FilterEnum:
 *       type: string
 *       description: Filter for favorites or archived certificates.
 *       enum: [favorites, archived]
 */
export const FilterEnum = z.enum(['favorites', 'archived']);
export type Filter = z.infer<typeof FilterEnum>;

/**
 * @openapi
 * components:
 *   schemas:
 *     GetCertificatesQuery:
 *       type: object
 *       properties:
 *         q:
 *           type: string
 *           description: Optional search query for filtering certificates.
 *         tag:
 *           type: string
 *           description: Optional tag filter.
 *         sortBy:
 *           $ref: '#/components/schemas/SortByEnum'
 *         filter:
 *           $ref: '#/components/schemas/FilterEnum'
 *         page:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *           description: The page number for pagination.
 *         limit:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 12
 *           description: Number of items per page.
 */
export const getCertificatesQuerySchema = z.object({
  query: z.object({
    q: z.string().optional(),
    tag: z.string().optional(),
    sortBy: SortByEnum.default('date-desc'),
    filter: FilterEnum.optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(12),
  }),
});

export type GetCertificatesQuery = z.infer<
  typeof getCertificatesQuerySchema
>['query'];
