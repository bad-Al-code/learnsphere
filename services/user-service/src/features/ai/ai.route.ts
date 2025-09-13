import { Router } from 'express';
import { requireAuth } from '../../middlewares/require-auth';
import { validateRequest } from '../../middlewares/validate-request';
import { AiController } from './ai.controller';
import {
  conversationIdParamSchema,
  createConversationSchema,
  renameConversationSchema,
  tutorChatSchema,
} from './ai.schema';

const router = Router();

router.use(requireAuth);

/**
 * @openapi
 * /api/ai/tutor-chat:
 *   post:
 *     summary: Send a message to the AI Tutor for a specific course
 *     tags: [AI Tools]
 *     security:
 *       - cookieAuth: []
 *     description: |
 *       Allows an authenticated and enrolled user to interact with the AI Tutor.
 *       The service uses the course content and previous chat history as context
 *       to generate a relevant response from the Gemini API.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - courseId
 *               - prompt
 *             properties:
 *               courseId:
 *                 type: string
 *                 format: uuid
 *                 description: The ID of the course the user is asking about.
 *               prompt:
 *                 type: string
 *                 description: The user's question or message to the AI tutor.
 *                 example: "Can you explain closures in JavaScript?"
 *     responses:
 *       '200':
 *         description: The AI Tutor's response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                   example: "Of course! A closure is when a function remembers the variables from the scope where it was created..."
 *       '400':
 *         description: Bad Request (e.g., missing prompt, invalid UUID).
 *       '401':
 *         description: Unauthorized (user is not authenticated).
 *       '403':
 *         description: Forbidden (user is not enrolled in the specified course).
 *       '404':
 *         description: Not Found (course content is not available for this course).
 */
router.post(
  '/tutor-chat',
  validateRequest(tutorChatSchema),
  AiController.handleTutorChat
);

/**
 * @openapi
 * /api/ai/tutor/conversations:
 *   get:
 *     summary: Get all AI Tutor conversations for the current user
 *     tags: [AI Tools]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: A list of the user's conversations.
 */
router.get('/tutor/conversations', AiController.getConversations);

/**
 * @openapi
 * /api/ai/tutor/conversations:
 *   post:
 *     summary: Create a new, empty AI Tutor conversation
 *     tags: [AI Tools]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseId:
 *                 type: string
 *                 format: uuid
 *               title:
 *                 type: string
 *     responses:
 *       '201':
 *         description: The newly created conversation object.
 */
router.post(
  '/tutor/conversations',
  validateRequest(createConversationSchema),
  AiController.createConversation
);

/**
 * @openapi
 * /api/ai/tutor/conversations/{id}:
 *   patch:
 *     summary: Rename a specific conversation
 *     tags: [AI Tools]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Conversation renamed successfully.
 */
router.patch(
  '/tutor/conversations/:id',
  validateRequest(conversationIdParamSchema.merge(renameConversationSchema)),
  AiController.renameConversation
);

/**
 * @openapi
 * /api/users/ai/tutor/conversations/{id}:
 *   delete:
 *     summary: Delete a specific conversation
 *     tags: [AI Tools]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       '204':
 *         description: Conversation deleted successfully.
 */
router.delete(
  '/tutor/conversations/:id',
  validateRequest(conversationIdParamSchema),
  AiController.deleteConversation
);

export { router as aiRouter };
