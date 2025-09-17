import { z } from 'zod';
import { feedbackTypeEnum } from '../../../db/schema';

/**
 * @openapi
 * components:
 *   schemas:
 *     GetAssignmentsQuery:
 *       type: object
 *       required:
 *         - courseId
 *       properties:
 *         courseId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the course to fetch assignments for.
 */
export const getAssignmentsQuerySchema = z.object({
  query: z.object({
    courseId: z.string().uuid('A valid courseId is required.'),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateAssignmentRequest:
 *       type: object
 *       required:
 *         - courseId
 *         - title
 *       properties:
 *         courseId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the course this assignment belongs to.
 *         title:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *           description: Title of the assignment.
 *         prompt:
 *           type: string
 *           nullable: true
 *           description: Optional prompt or question associated with the assignment.
 *         content:
 *           type: string
 *           nullable: true
 *           description: Optional content or instructions for the assignment.
 */
export const createAssignmentSchema = z.object({
  body: z.object({
    courseId: z.string().uuid('A valid courseId is required.'),
    title: z.string().min(1, 'Title is required.').max(255),
    prompt: z.string().optional(),
    content: z.string().optional(),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     AssignmentIdParam:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the assignment.
 */
export const assignmentIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('A valid assignment ID is required.'),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateAssignmentRequest:
 *       type: object
 *       description: Schema for updating an assignment. At least one field must be provided.
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *           description: Updated title of the assignment.
 *         content:
 *           type: string
 *           description: Updated content/body of the assignment.
 *         prompt:
 *           type: string
 *           description: Updated writing prompt for the assignment.
 *       example:
 *         title: "Updated Assignment Title"
 *         content: "Revised assignment content..."
 *         prompt: "New prompt for the assignment"
 */
export const updateAssignmentSchema = z.object({
  body: z
    .object({
      title: z.string().min(1).max(255).optional(),
      content: z.string().optional(),
      prompt: z.string().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message:
        'At least one field (title, content, or prompt) must be provided for an update.',
    }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     GenerateDraftRequest:
 *       type: object
 *       description: Schema for generating a draft assignment.
 *       properties:
 *         courseId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the course.
 *         title:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *           description: Draft title.
 *         prompt:
 *           type: string
 *           minLength: 10
 *           maxLength: 2000
 *           description: Writing prompt for generating the draft.
 *       required:
 *         - courseId
 *         - title
 *         - prompt
 *       example:
 *         courseId: "123e4567-e89b-12d3-a456-426614174000"
 *         title: "Introduction to Philosophy"
 *         prompt: "Write a 500-word essay on the significance of Socratic questioning."
 */
export const generateDraftSchema = z.object({
  body: z.object({
    courseId: z.string().uuid(),
    title: z.string().min(1).max(255),
    prompt: z
      .string()
      .min(10, 'Prompt must be at least 10 characters.')
      .max(2000),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     GetFeedbackRequest:
 *       type: object
 *       description: Schema for requesting feedback on a draft or assignment.
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The unique identifier of the assignment.
 *         feedbackType:
 *           type: string
 *           enum: [Grammar, Style, Clarity, Argument]
 *           description: The type of feedback to request.
 *       required:
 *         - id
 *         - feedbackType
 *       example:
 *         id: "123e4567-e89b-12d3-a456-426614174000"
 *         feedbackType: "Clarity"
 */
export const getFeedbackSchema = z.object({
  params: z.object({
    id: z.string().uuid('A valid assignment ID is required.'),
  }),
  body: z.object({
    feedbackType: z.enum(feedbackTypeEnum.enumValues),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     DraftResponse:
 *       type: object
 *       description: Response returned by the AI when generating a draft.
 *       properties:
 *         draftContent:
 *           type: string
 *           description: The generated draft content.
 *       required:
 *         - draftContent
 *       example:
 *         draftContent: "This is the generated draft content based on the user's prompt."
 */
export const draftResponseSchemaZod = z.object({
  draftContent: z.string(),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     FeedbackSuggestion:
 *       type: object
 *       description: A single feedback suggestion returned by the AI.
 *       properties:
 *         originalText:
 *           type: string
 *           description: The original text from the assignment.
 *         suggestion:
 *           type: string
 *           description: The AI's suggested improvement for the text.
 *         explanation:
 *           type: string
 *           description: Explanation for why this suggestion was made.
 *       required:
 *         - originalText
 *         - suggestion
 *         - explanation
 *       example:
 *         originalText: "This sentence is unclear."
 *         suggestion: "Rewrite as: 'This sentence could be clearer.'"
 *         explanation: "The original sentence is ambiguous and could confuse the reader."
 *
 *     FeedbackResponse:
 *       type: object
 *       description: Response returned by the AI when generating feedback.
 *       properties:
 *         suggestions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/FeedbackSuggestion'
 *       required:
 *         - suggestions
 *       example:
 *         suggestions:
 *           - originalText: "This sentence is unclear."
 *             suggestion: "Rewrite as: 'This sentence could be clearer.'"
 *             explanation: "The original sentence is ambiguous and could confuse the reader."
 */
export const feedbackResponseSchemaZod = z.object({
  suggestions: z.array(
    z.object({
      originalText: z.string(),
      suggestion: z.string(),
      explanation: z.string(),
    })
  ),
});

export type DraftResponse = z.infer<typeof draftResponseSchemaZod>;
export type FeedbackResponse = z.infer<typeof feedbackResponseSchemaZod>;
