import { z } from 'zod';

/**
 * @openapi
 * components:
 *   schemas:
 *     GetNotesQuery:
 *       type: object
 *       properties:
 *         query:
 *           type: object
 *           required:
 *             - courseId
 *           properties:
 *             courseId:
 *               type: string
 *               format: uuid
 *               description: A valid courseId is required.
 */
export const getNotesQuerySchema = z.object({
  query: z.object({
    courseId: z.string().uuid('A valid courseId is required.'),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateNote:
 *       type: object
 *       properties:
 *         body:
 *           type: object
 *           required:
 *             - courseId
 *             - title
 *           properties:
 *             courseId:
 *               type: string
 *               format: uuid
 *               description: A valid courseId is required.
 *             title:
 *               type: string
 *               maxLength: 255
 *               description: Title of the note (1–255 characters).
 *             content:
 *               type: string
 *               nullable: true
 *               description: Optional content for the note.
 */
export const createNoteSchema = z.object({
  body: z.object({
    courseId: z.string().uuid('A valid courseId is required.'),
    title: z.string().min(1, 'Title is required.').max(255),
    content: z.string().optional(),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     NoteIdParam:
 *       type: object
 *       properties:
 *         params:
 *           type: object
 *           required:
 *             - id
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               description: A valid note ID is required.
 */
export const noteIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('A valid note ID is required.'),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateNote:
 *       type: object
 *       properties:
 *         body:
 *           type: object
 *           description: At least one field (title or content) must be provided for an update.
 *           properties:
 *             title:
 *               type: string
 *               maxLength: 255
 *               description: Optional new title for the note.
 *             content:
 *               type: string
 *               description: Optional new content for the note.
 */
export const updateNoteSchema = z.object({
  body: z
    .object({
      title: z.string().min(1).max(255).optional(),
      content: z.string().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message:
        'At least one field (title or content) must be provided for an update.',
    }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     AnalyzeNoteParam:
 *       type: object
 *       properties:
 *         params:
 *           type: object
 *           required:
 *             - id
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               description: A valid note ID is required.
 */
export const analyzeNoteSchema = z.object({
  params: z.object({
    id: z.string().uuid('A valid note ID is required.'),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     NoteInsights:
 *       type: object
 *       required:
 *         - keyConcepts
 *         - studyActions
 *         - knowledgeGaps
 *       properties:
 *         keyConcepts:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of important concepts identified in the note.
 *         studyActions:
 *           type: array
 *           items:
 *             type: string
 *           description: Suggested actions or study steps based on the note.
 *         knowledgeGaps:
 *           type: array
 *           items:
 *             type: string
 *           description: Topics or areas where the note indicates gaps in understanding.
 */
export const noteAnalysisZodSchema = z.object({
  keyConcepts: z.array(z.string()),
  studyActions: z.array(z.string()),
  knowledgeGaps: z.array(z.string()),
});

export type NoteInsights = z.infer<typeof noteAnalysisZodSchema>;
