import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { requireAuth } from '../middlewares/require-auth';
import { validateRequest } from '../middlewares/validate-request';
import {
  courseDiscussionsParamsSchema,
  createDiscussionSchema,
  createStudyRoomSchema,
  discussionsParamsSchema,
  generateShareLinkSchema,
  inviteUsersSchema,
  joinRoomParamsSchema,
  listStudyRoomsSchema,
  messageParamsSchema,
  postReplySchema,
  reactMessageSchema,
  roomParamsSchema,
  updateStudyRoomSchema,
} from '../schemas';
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
 *     description: Retrieve a list of study rooms filtered by topic, optional search, and paginated.
 *     tags:
 *       - Community
 *     parameters:
 *       - in: query
 *         name: topic
 *         schema:
 *           type: string
 *           example: React
 *         required: false
 *         description: Topic/category filter. Use `all` to return all topics.
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *           example: Workshop
 *         required: false
 *         description: Search string for room names.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 9
 *           minimum: 1
 *           maximum: 20
 *         required: false
 *         description: Maximum number of rooms to return.
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *           format: uuid
 *         required: false
 *         description: UUID of the last item from previous page for pagination.
 *     responses:
 *       200:
 *         description: List of study rooms with metadata.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 rooms:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "room_123"
 *                       title:
 *                         type: string
 *                         example: "React Workshop"
 *                       subtitle:
 *                         type: string
 *                         example: "Hands-on React learning session"
 *                       host:
 *                         type: string
 *                         example: "Hosted By Alice"
 *                       participants:
 *                         type: integer
 *                         example: 12
 *                       maxParticipants:
 *                         type: integer
 *                         example: 50
 *                       duration:
 *                         type: string
 *                         example: "45m"
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["React", "Workshop"]
 *                       progress:
 *                         type: integer
 *                         description: Percentage of room capacity filled
 *                         example: 24
 *                       isLive:
 *                         type: boolean
 *                         example: true
 *                       isPrivate:
 *                         type: boolean
 *                         example: false
 *                       time:
 *                         type: string
 *                         format: time
 *                         example: "3:00 PM"
 *                 nextCursor:
 *                   type: string
 *                   nullable: true
 *                   description: Cursor for next page of results.
 *       400:
 *         description: Invalid query parameters.
 *       401:
 *         description: Unauthorized.
 */
router.get(
  '/study-rooms',
  requireAuth,
  validateRequest(listStudyRoomsSchema),
  ChatController.getStudyRooms
);

/**
 * @openapi
 * /api/community/study-rooms:
 *   post:
 *     summary: Create a new study room
 *     description: Creates a new study room for the authenticated user. Fails if a room with the same name already exists for that user.
 *     tags:
 *       - Community
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStudyRoom'
 *     responses:
 *       201:
 *         description: Study room successfully created.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "room_123"
 *                 name:
 *                   type: string
 *                   example: "React Deep Dive"
 *                 description:
 *                   type: string
 *                   example: "Let's master React Hooks and advanced patterns together!"
 *                 category:
 *                   type: string
 *                   example: "React"
 *                 tags:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["React", "Frontend"]
 *                 maxParticipants:
 *                   type: integer
 *                   example: 15
 *                 isPrivate:
 *                   type: boolean
 *                   example: false
 *                 durationMinutes:
 *                   type: integer
 *                   example: 90
 *                 startTime:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-09-26T06:00:00.000Z"
 *                 createdById:
 *                   type: string
 *                   example: "b06531a1-2563-4702-8706-819ce72649ac"
 *       400:
 *         description: Bad request, e.g., a study room with the same name already exists.
 *       401:
 *         description: Unauthorized, user must be authenticated.
 */
router.post(
  '/study-rooms',
  requireAuth,
  validateRequest(createStudyRoomSchema),
  ChatController.createStudyRoom
);

/**
 * @openapi
 * /api/community/study-rooms/{roomId}/join:
 *   post:
 *     summary: Join a study room
 *     description: Allows an authenticated user to join a study room if it's not full and they are not already a participant.
 *     tags:
 *       - Community
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique ID of the study room to join
 *     responses:
 *       200:
 *         description: Successfully joined the study room
 *       400:
 *         description: Study room is full or invalid request
 *       401:
 *         description: Unauthorized - user must be authenticated
 *       404:
 *         description: Study room not found
 */
router.post(
  '/study-rooms/:roomId/join',
  requireAuth,
  validateRequest(joinRoomParamsSchema),
  ChatController.joinStudyRoom
);

/**
 * @openapi
 * /api/community/study-rooms/{roomId}:
 *   put:
 *     summary: Update a study room
 *     description: Updates the specified study room if the authenticated user is the creator.
 *     tags:
 *       - Community
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique ID of the study room to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               maxParticipants:
 *                 type: integer
 *               isPrivate:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Successfully updated the study room
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requester is not the creator
 *       404:
 *         description: Study room not found
 */
router.put(
  '/study-rooms/:roomId',
  requireAuth,
  validateRequest(updateStudyRoomSchema),
  ChatController.updateStudyRoom
);

/**
 * @openapi
 * /api/community/study-rooms/{roomId}:
 *   delete:
 *     summary: Delete a study room
 *     description: Deletes the specified study room if the authenticated user is the creator.
 *     tags:
 *       - Community
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique ID of the study room to delete
 *     responses:
 *       200:
 *         description: Successfully deleted the study room
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - requester is not the creator
 *       404:
 *         description: Study room not found
 */
router.delete(
  '/study-rooms/:roomId',
  requireAuth,
  validateRequest(roomParamsSchema),
  ChatController.deleteStudyRoom
);

router.post(
  '/study-rooms/:roomId/schedule-reminder',
  requireAuth,
  validateRequest(roomParamsSchema),
  ChatController.scheduleReminder
);

/**
 * @openapi
 * /api/community/study-rooms/{roomId}/share:
 *   post:
 *     summary: Generate a shareable link for a study room
 *     description: Creates a JWT-based share link for a study room if the requester is the room creator.
 *     tags:
 *       - Community
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the study room
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               expiresIn:
 *                 type: string
 *                 enum: [1hour, 24hours, 7days, never]
 *                 description: Expiration time for the share link
 *     responses:
 *       200:
 *         description: Share link generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 shareLink:
 *                   type: string
 *                   format: uri
 *                   example: http://localhost:3000/student/community/join-room?token=abcd1234
 *       403:
 *         description: Forbidden - requester is not the room creator
 */
router.post(
  '/study-rooms/:roomId/share',
  requireAuth,
  validateRequest(generateShareLinkSchema),
  ChatController.generateShareLink
);

/**
 * @openapi
 * /api/community/study-rooms/{roomId}/invite-users:
 *   post:
 *     tags:
 *       - Community
 *     summary: Invite users to a study room
 *     description: Sends invitations to one or more users to join the specified study room.
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the study room.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userIds
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 description: Array of user IDs to invite.
 *     responses:
 *       200:
 *         description: Invitations successfully sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invitations sent to 3 users.
 *       401:
 *         description: Unauthorized – user must be logged in.
 *       404:
 *         description: Study room not found.
 */
router.post(
  '/study-rooms/:roomId/invite-users',
  requireAuth,
  validateRequest(inviteUsersSchema),
  ChatController.inviteUsersToRoom
);

/**
 * @openapi
 * /api/community/messages/{messageId}/upvote:
 *   post:
 *     summary: Upvote a message
 *     description: Adds or removes an upvote reaction on a message for the authenticated user. Any existing downvote from the same user will be removed automatically.
 *     tags:
 *       - community
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the message to upvote.
 *     responses:
 *       201:
 *         description: Upvote added successfully.
 *       200:
 *         description: Upvote removed successfully.
 *       401:
 *         description: Unauthorized (user not authenticated).
 */
router.post(
  '/messages/:messageId/upvote',
  requireAuth,
  validateRequest(messageParamsSchema),
  ChatController.upvoteMessage
);

/**
 * @openapi
 * /api/community/messages/{messageId}/downvote:
 *   post:
 *     summary: Downvote a message
 *     description: Adds or removes a downvote reaction on a message for the authenticated user. Any existing upvote from the same user will be removed automatically.
 *     tags:
 *       - community
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the message to downvote.
 *     responses:
 *       201:
 *         description: Downvote added successfully.
 *       200:
 *         description: Downvote removed successfully.
 *       401:
 *         description: Unauthorized (user not authenticated).
 */
router.post(
  '/messages/:messageId/downvote',
  requireAuth,
  validateRequest(messageParamsSchema),
  ChatController.downvoteMessage
);

/**
 * @openapi
 * /api/community/messages/{messageId}/react:
 *   post:
 *     summary: React to a message
 *     description: Adds or removes a specific reaction (e.g., upvote or downvote) to a message for the authenticated user.
 *     tags:
 *       - community
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the message to react to.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reaction:
 *                 type: string
 *                 enum: [upvote, downvote]
 *                 description: The type of reaction to apply.
 *             required:
 *               - reaction
 *     responses:
 *       201:
 *         description: Reaction added successfully.
 *       200:
 *         description: Reaction removed successfully.
 *       401:
 *         description: Unauthorized (user not authenticated).
 */
router.post(
  '/messages/:messageId/react',
  requireAuth,
  validateRequest(reactMessageSchema),
  ChatController.reactToMessage
);

export { router as chatRouter };
