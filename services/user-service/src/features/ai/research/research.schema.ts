import { z } from 'zod';

/**
 * @openapi
 * components:
 *   schemas:
 *     PerformResearchRequest:
 *       type: object
 *       required:
 *         - courseId
 *         - query
 *       properties:
 *         courseId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the course.
 *         query:
 *           type: string
 *           minLength: 3
 *           maxLength: 200
 *           description: The research query text.
 */
export const performResearchSchema = z.object({
  body: z.object({
    courseId: z.string().uuid(),
    query: z.string().min(3).max(200),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     SaveFindingRequest:
 *       type: object
 *       required:
 *         - courseId
 *         - finding
 *       properties:
 *         courseId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the course.
 *         finding:
 *           type: object
 *           required:
 *             - title
 *           properties:
 *             title:
 *               type: string
 *               description: Title of the research finding.
 *             source:
 *               type: string
 *               description: Source of the finding.
 *             url:
 *               type: string
 *               format: uri
 *               description: URL of the finding.
 *             description:
 *               type: string
 *               description: Short description of the finding.
 *             tags:
 *               type: array
 *               items:
 *                 type: string
 *               description: Tags for categorization.
 *             relevance:
 *               type: integer
 *               description: Relevance score assigned by the user or system.
 */
export const saveFindingSchema = z.object({
  body: z.object({
    courseId: z.string().uuid(),
    finding: z.object({
      title: z.string(),
      source: z.string().optional(),
      url: z.string().url().optional(),
      description: z.string().optional(),
      tags: z.array(z.string()).optional(),
      relevance: z.number().int().optional(),
    }),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     FindingIdParam:
 *       type: object
 *       required:
 *         - findingId
 *       properties:
 *         findingId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the finding.
 */
export const findingIdParamSchema = z.object({
  params: z.object({
    findingId: z.string().uuid(),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateFindingNotesRequest:
 *       type: object
 *       required:
 *         - userNotes
 *       properties:
 *         userNotes:
 *           type: string
 *           description: User's personal notes for the finding.
 */
export const updateFindingNotesSchema = z.object({
  body: z.object({
    userNotes: z.string(),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     GetBoardQuery:
 *       type: object
 *       required:
 *         - courseId
 *       properties:
 *         courseId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the course.
 */
export const getBoardQuerySchema = z.object({
  query: z.object({
    courseId: z.string().uuid(),
  }),
});

export const researchResponseSchemaZod = z.object({
  findings: z.array(
    z.object({
      title: z.string(),
      source: z.string(),
      url: z.string().url().optional(),
      description: z.string(),
      tags: z.array(z.string()),
      relevance: z.number().int().min(0).max(100).optional(),
    })
  ),
});
export type ResearchResponse = z.infer<typeof researchResponseSchemaZod>;
