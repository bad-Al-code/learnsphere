import { Router } from 'express';
import { requireAuth } from '../../middlewares/require-auth';
import { validateRequest } from '../../middlewares/validate-request';
import { AiController } from './ai.controller';
import { tutorChatSchema } from './ai.schema';

const router = Router();

router.use(requireAuth);

/**
 * @openapi
 * /api/users/ai/tutor-chat:
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

export { router as aiRouter };
