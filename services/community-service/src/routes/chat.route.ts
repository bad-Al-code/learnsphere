import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { requireAuth } from '../middlewares/require-auth';
import { validateRequest } from '../middlewares/validate-request';
import {
  createConversationSchema,
  createGroupConversationSchema,
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
 * /api/community/study-groups:
 *   get:
 *     summary: Get a list of public study groups
 *     tags: [Chat]
 *     responses:
 *       '200':
 *         description: A list of public study groups with participant info.
 */
router.get('/study-groups', ChatController.getPublicStudyGroups);

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
 * /api/community/conversations/group:
 *   post:
 *     summary: Create a new group conversation
 *     tags: [Chat]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, participantIds]
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the group chat.
 *                 example: "React Study Group"
 *               participantIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 description: An array of user IDs to include in the group.
 *     responses:
 *       '201':
 *         description: Successfully created the group conversation.
 */
router.post(
  '/conversations/group',
  validateRequest(createGroupConversationSchema),
  ChatController.createGroupConversation
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

/**
 * @openapi
 * /api/community/conversations/{id}/participants:
 *   get:
 *     summary: Get the list of participants for a conversation
 *     tags: [Chat]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       '200':
 *         description: An array of participant objects.
 *       '403':
 *         description: User is not a member of the conversation.
 */
router.get('/conversations/:id/participants', ChatController.getParticipants);

/**
 * @openapi
 * /conversations/{id}/participants:
 *   post:
 *     summary: Add a participant to a group conversation
 *     tags: [Chat]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Conversation ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user to add
 *     responses:
 *       200:
 *         description: User added to group
 *       403:
 *         description: Forbidden
 */
router.post('/conversations/:id/participants', ChatController.addParticipant);

/**
 * @openapi
 * /conversations/{id}/participants/{userId}:
 *   delete:
 *     summary: Remove a participant from a group conversation
 *     tags: [Chat]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Conversation ID
 *         schema:
 *           type: string
 *       - name: userId
 *         in: path
 *         required: true
 *         description: User ID to remove
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User removed from group
 *       400:
 *         description: Cannot remove yourself
 *       403:
 *         description: Forbidden
 */
router.delete(
  '/conversations/:id/participants/:userId',
  ChatController.removeParticipant
);

export { router as chatRouter };
