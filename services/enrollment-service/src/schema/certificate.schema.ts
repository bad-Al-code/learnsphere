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

/**
 * @openapi
 * components:
 *   schemas:
 *     CertificateParams:
 *       type: object
 *       properties:
 *         params:
 *           type: object
 *           properties:
 *             enrollmentId:
 *               type: string
 *               format: uuid
 *               description: The unique identifier for an enrollment.
 *           required:
 *             - enrollmentId
 *       required:
 *         - params
 *       example:
 *         params:
 *           enrollmentId: "123e4567-e89b-12d3-a456-426614174000"
 */
export const certificateParamsSchema = z.object({
  params: z.object({
    enrollmentId: z.string().uuid('Invalid enrollment ID format.'),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateNotes:
 *       type: object
 *       properties:
 *         body:
 *           type: object
 *           properties:
 *             notes:
 *               type: string
 *               maxLength: 1000
 *               description: Notes or comments about the certificate. Cannot exceed 1000 characters.
 *           required:
 *             - notes
 *       required:
 *         - body
 *       example:
 *         body:
 *           notes: "This course helped me understand advanced concepts clearly."
 */
export const updateNotesSchema = z.object({
  body: z.object({
    notes: z.string().max(1000, 'Notes cannot exceed 1000 characters.'),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     BulkActionRequest:
 *       type: object
 *       required:
 *         - body
 *       properties:
 *         body:
 *           type: object
 *           required:
 *             - enrollmentIds
 *           properties:
 *             enrollmentIds:
 *               type: array
 *               description: A list of enrollment IDs to perform the bulk action on.
 *               items:
 *                 type: string
 *                 format: uuid
 *               minItems: 1
 *               example:
 *                 - "b2c52c46-35ef-4a87-8f68-d03811e26793"
 *                 - "e13a0f24-5b9b-46b3-a4f9-3b8344a52b6c"
 */
export const bulkActionSchema = z.object({
  body: z.object({
    enrollmentIds: z
      .array(z.string().uuid())
      .nonempty('At least one enrollment ID is required.'),
  }),
});
