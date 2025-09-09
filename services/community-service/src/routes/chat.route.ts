import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { requireAuth } from '../middlewares/require-auth';
import { validateRequest } from '../middlewares/validate-request';
import {
  createConversationSchema,
  getMessagesSchema,
} from '../schemas/chat.schema';

const router = Router();

router.use(requireAuth);

/**
 * @openapi
 * /api/community/conversations:
 *   get:
 *     summary: Get all conversations for the current user
 *     tags: [Chat]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: A list of the user's conversations.
 */
router.get('/conversations', ChatController.getConversations);

/**
 * @openapi
 * /api/community/conversations/{id}/messages:
 *   get:
 *     summary: Get message history for a specific conversation
 *     tags: [Chat]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the conversation.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *     responses:
 *       '200':
 *         description: A paginated list of messages.
 *       '403':
 *         description: User is not a participant of the conversation.
 */
router.get(
  '/conversations/:id/messages',
  validateRequest(getMessagesSchema),
  ChatController.getMessages
);

/**
 * @openapi
 * /api/community/conversations:
 *   post:
 *     summary: Create or retrieve a direct message conversation
 *     tags: [Chat]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [recipientId]
 *             properties:
 *               recipientId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       '201':
 *         description: Successfully created or retrieved the conversation.
 */
router.post(
  '/conversations',
  validateRequest(createConversationSchema),
  ChatController.createConversation
);

/**
 * @openapi
 * /api/community/conversations/{id}/read:
 *   post:
 *     summary: Mark all messages in a conversation as read
 *     tags: [Chat]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the conversation.
 *     responses:
 *       '200':
 *         description: Successfully marked messages as read.
 *       '403':
 *         description: User is not a participant of the conversation.
 */
router.post('/conversations/:id/read', ChatController.markAsRead);

export { router as chatRouter };
