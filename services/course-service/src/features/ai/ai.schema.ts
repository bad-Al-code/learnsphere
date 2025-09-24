import z from 'zod';

/**
 * @openapi
 * components:
 *   schemas:
 *     RequestRecheckParams:
 *       type: object
 *       required:
 *         - submissionId
 *       properties:
 *         submissionId:
 *           type: string
 *           format: uuid
 *           description: The unique identifier of the submission to recheck.
 */
export const requestRecheckParamsSchema = z.object({
  submissionId: z.string().uuid(),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     DraftSuggestionsParams:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier of the draft for which suggestions will be generated.
 */
export const draftSuggestionsParamsSchema = z.object({
  params: z.object({
    id: z.string().uuid({ message: 'Invalid draft id. Must be a UUID' }),
  }),
});
