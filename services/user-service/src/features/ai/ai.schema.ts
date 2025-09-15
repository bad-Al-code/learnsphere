import { z } from 'zod';

/**
 * @openapi
 * components:
 *   schemas:
 *     TutorChatRequest:
 *       type: object
 *       required:
 *         - courseId
 *         - prompt
 *       properties:
 *         courseId:
 *           type: string
 *           format: uuid
 *           description: Unique ID of the course.
 *         prompt:
 *           type: string
 *           minLength: 1
 *           maxLength: 5000
 *           description: User's input message for the tutor.
 *         conversationId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: Existing conversation ID if continuing a chat.
 */
export const tutorChatSchema = z.object({
  body: z.object({
    courseId: z.string().uuid('Invalid course ID format.'),
    prompt: z.string().min(1, 'Prompt cannot be empty.').max(5000),
    conversationId: z
      .string()
      .uuid('Invalid conversation ID format.')
      .optional(),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateConversationRequest:
 *       type: object
 *       required:
 *         - courseId
 *       properties:
 *         courseId:
 *           type: string
 *           format: uuid
 *           description: Unique ID of the course.
 *         title:
 *           type: string
 *           minLength: 1
 *           description: Optional title for the conversation.
 */
export const createConversationSchema = z.object({
  body: z.object({
    courseId: z.string().uuid('Invalid course ID format.'),
    title: z.string().min(1, 'Title is requierd').optional(),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     ConversationIdParam:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Unique ID of the conversation.
 */
export const conversationIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid conversation ID format.'),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     RenameConversationRequest:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *           description: New title for the conversation.
 */
export const renameConversationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title cannot be empty.').max(255),
  }),
});

export const getConversationsSchema = z.object({
  query: z.object({
    courseId: z.string().uuid('Invalid courseId format in query parameter.'),
  }),
});
