import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { requireAuth } from '../middlewares/require-auth';
import { validateRequest } from '../middlewares/validate-request';
import {
  courseDiscussionsParamsSchema,
  createDiscussionSchema,
  discussionsParamsSchema,
  postReplySchema,
} from '../schemas';
import {
  createConversationSchema,
  createGroupConversationSchema,
  getMessagesSchema,
  getStudyRoomsSchema,
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

/**
 * @openapi
 * /api/community/discussions/course/{courseId}:
 *   get:
 *     tags:
 *       - Chat
 *     summary: Get all discussions for a course
 *     description: Retrieves all group discussions for a given course, including participants and metadata.
 *     parameters:
 *       - $ref: '#/components/parameters/CourseIdParam'
 *     responses:
 *       200:
 *         description: List of discussions for the course
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   title:
 *                     type: string
 *                   course:
 *                     type: string
 *                     format: uuid
 *                   author:
 *                     type: string
 *                   replies:
 *                     type: integer
 *                   lastReply:
 *                     type: string
 *                   isResolved:
 *                     type: boolean
 *                   isBookmarked:
 *                     type: boolean
 *                   views:
 *                     type: integer
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 */
router.get(
  '/discussions/course/:courseId',
  requireAuth,
  validateRequest(courseDiscussionsParamsSchema),
  ChatController.getCourseDiscussions
);

/**
 * @openapi
 * /api/community/discussions:
 *   post:
 *     tags:
 *       - Chat
 *     summary: Create a new discussion
 *     description: Creates a new discussion for a course or assignment. Throws a 409 Conflict if the discussion name already exists for the creator.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDiscussionBody'
 *     responses:
 *       201:
 *         description: Discussion successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 name:
 *                   type: string
 *                 courseId:
 *                   type: string
 *                   format: uuid
 *                 assignmentId:
 *                   type: string
 *                   format: uuid
 *                   nullable: true
 *                 content:
 *                   type: string
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                 createdById:
 *                   type: string
 *                   format: uuid
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 */
router.post(
  '/discussions',
  requireAuth,
  validateRequest(createDiscussionSchema),
  ChatController.createDiscussion
);
/**
 * @openapi
 * /api/community/discussions/{id}/replies:
 *   get:
 *     summary: Get all replies for a discussion
 *     tags:
 *       - Community
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the discussion
 *     responses:
 *       200:
 *         description: List of replies for the discussion
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PostReplyBody'
 *       403:
 *         description: User is not authorized to view these replies
 */
router.get(
  '/discussions/:id/replies',
  requireAuth,
  validateRequest(discussionsParamsSchema),
  ChatController.getReplies
);

/**
 * @openapi
 * /api/community/discussions/{id}/reply:
 *   post:
 *     summary: Post a reply to a discussion
 *     tags:
 *       - Community
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the discussion
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostReplyBody'
 *     responses:
 *       201:
 *         description: Reply posted successfully
 *       403:
 *         description: User is not a participant in the discussion
 */
router.post(
  '/discussions/:id/reply',
  requireAuth,
  validateRequest(postReplySchema),
  ChatController.postReply
);

/**
 * @openapi
 * /api/community/discussions/{id}/bookmark:
 *   post:
 *     summary: Toggle bookmark for a discussion
 *     tags:
 *       - Community
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the discussion
 *     responses:
 *       200:
 *         description: Bookmark toggled successfully
 *       403:
 *         description: User is not a participant in the discussion
 */
router.post(
  '/discussions/:id/bookmark',
  requireAuth,
  validateRequest(discussionsParamsSchema),
  ChatController.bookmark
);

/**
 * @openapi
 * /api/community/discussions/{id}/resolve:
 *   post:
 *     summary: Toggle the resolved status of a discussion
 *     tags:
 *       - Community
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the discussion
 *     responses:
 *       200:
 *         description: Discussion resolved/unresolved successfully
 *       403:
 *         description: Only the original author can resolve this discussion
 */
router.post(
  '/discussions/:id/resolve',
  requireAuth,
  validateRequest(discussionsParamsSchema),
  ChatController.resolve
);

/**
 * @openapi
 * /api/community/study-rooms:
 *   get:
 *     summary: Get study rooms
 *     description: Retrieve a list of study rooms filtered by topic and optional search query.
 *     tags:
 *       - Community
 *     parameters:
 *       - in: query
 *         name: topic
 *         schema:
 *           type: string
 *           example: React
 *         required: false
 *         description: Filter study rooms by topic/category. Use `all` to return all topics.
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *           example: Workshop
 *         required: false
 *         description: Search string to match against study room names.
 *     responses:
 *       200:
 *         description: A list of study rooms.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "room_123"
 *                   title:
 *                     type: string
 *                     example: "React Workshop"
 *                   subtitle:
 *                     type: string
 *                     example: "Hands-on React learning session"
 *                   host:
 *                     type: string
 *                     example: "Hosted By Alice"
 *                   participants:
 *                     type: integer
 *                     example: 12
 *                   maxParticipants:
 *                     type: integer
 *                     example: 50
 *                   duration:
 *                     type: string
 *                     example: "45m"
 *                   tags:
 *                     type: array
 *                     items:
 *                       type: string
 *                     example: ["React", "Workshop"]
 *                   progress:
 *                     type: integer
 *                     description: Percentage of room capacity filled
 *                     example: 24
 *                   isLive:
 *                     type: boolean
 *                     example: true
 *                   isPrivate:
 *                     type: boolean
 *                     example: false
 *                   time:
 *                     type: string
 *                     format: time
 *                     example: "3:00 PM"
 *       400:
 *         description: Invalid query parameters.
 *       401:
 *         description: Unauthorized.
 */
router.get(
  '/study-rooms',
  requireAuth,
  validateRequest(getStudyRoomsSchema),
  ChatController.getStudyRooms
);

export { router as chatRouter };
