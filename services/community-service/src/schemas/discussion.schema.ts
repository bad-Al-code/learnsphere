import { z } from 'zod';

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateDiscussionBody:
 *       type: object
 *       required:
 *         - name
 *         - courseId
 *         - content
 *       properties:
 *         name:
 *           type: string
 *           minLength: 5
 *           description: The title of the discussion.
 *         courseId:
 *           type: string
 *           format: uuid
 *           description: The ID of the course this discussion belongs to.
 *         assignmentId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: Optional assignment ID related to the discussion.
 *         content:
 *           type: string
 *           minLength: 10
 *           description: The content/body of the discussion.
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Optional tags for the discussion.
 */
export const createDiscussionSchema = z.object({
  body: z.object({
    name: z.string().min(5, 'Name must be at least 5 characters'),
    courseId: z.uuid(),
    assignmentId: z.uuid().optional(),
    content: z.string().min(10, 'Content must be at least 10 characters'),
    tags: z.array(z.string()).optional(),
  }),
});
export type CreateDiscussionDto = z.infer<
  typeof createDiscussionSchema
>['body'];

/**
 * @openapi
 * components:
 *   parameters:
 *     CourseIdParam:
 *       in: path
 *       name: courseId
 *       required: true
 *       schema:
 *         type: string
 *         format: uuid
 *       description: The ID of the course to fetch discussions for.
 */
export const courseDiscussionsParamsSchema = z.object({
  params: z.object({
    courseId: z.uuid(),
  }),
});

/**
 * @openapi
 * components:
 *   parameters:
 *     DiscussionIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *         format: uuid
 *       description: The ID of the discussion
 */
export const discussionsParamsSchema = z.object({
  params: z.object({
    id: z.uuid(),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     PostReplyBody:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           description: The content of the reply
 *           minLength: 1
 *     PostReplyParams:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The ID of the conversation to reply to
 */
export const postReplySchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Reply content cannot be empty.'),
  }),
  params: z.object({ id: z.uuid() }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateStudyRoom:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - category
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the study room.
 *           minLength: 5
 *           example: "React Deep Dive"
 *         description:
 *           type: string
 *           description: Detailed description of the study room.
 *           minLength: 10
 *           example: "Let's master React Hooks and advanced patterns together!"
 *         category:
 *           type: string
 *           description: The topic or category of the study room.
 *           example: "React"
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Optional tags to categorize the study room.
 *           example: ["React", "Frontend", "Workshop"]
 *         maxParticipants:
 *           type: integer
 *           description: Maximum number of participants allowed.
 *           minimum: 2
 *           maximum: 50
 *           default: 10
 *         isPrivate:
 *           type: boolean
 *           description: Whether the study room is private.
 *           default: false
 *         durationMinutes:
 *           type: integer
 *           description: Duration of the study room in minutes.
 *           example: 90
 *         startTime:
 *           type: string
 *           format: date-time
 *           description: Optional scheduled start time for the study room.
 *           example: "2025-09-26T06:00:00.000Z"
 */
export const createStudyRoomSchema = z
  .object({
    body: z.object({
      title: z.string().min(3, 'Title must be at least 3 characters.'),
      description: z
        .string()
        .min(10, 'Description must be at least 10 characters.'),
      category: z.string().min(1, 'Category is required.'),
      tags: z.array(z.string()).optional(),
      maxParticipants: z.number().int().min(2).max(50).default(10),
      isPrivate: z.boolean().default(false),
      durationMinutes: z.number().int().positive().optional(),
      startTime: z.iso.datetime().optional(),
      sessionType: z.enum(['now', 'later']),
    }),
  })
  .refine(
    (data) => {
      if (data.body.sessionType === 'later' && !data.body.startTime)
        return false;
      return true;
    },
    {
      message: 'Please select a start time for a scheduled session.',
      path: ['startTime'],
    }
  );

export type CreateStudyRoomDTO = z.infer<
  typeof createStudyRoomSchema.shape.body
>;

/**
 * @openapi
 * components:
 *   parameters:
 *     RoomIdParam:
 *       name: roomId
 *       in: path
 *       required: true
 *       description: The unique ID of the study room
 *       schema:
 *         type: string
 *         format: uuid
 */
export const joinRoomParamsSchema = z.object({
  params: z.object({
    roomId: z.uuid(),
  }),
});

/**
 * @openapi
 * components:
 *   parameters:
 *     RoomIdParam:
 *       name: roomId
 *       in: path
 *       required: true
 *       description: The unique ID of the study room
 *       schema:
 *         type: string
 *         format: uuid
 *   schemas:
 *     UpdateStudyRoomBody:
 *       type: object
 *       description: Fields to update in the study room
 *       properties:
 *         title:
 *           type: string
 *           minLength: 5
 *           description: The new title of the study room
 *         description:
 *           type: string
 *           minLength: 10
 *           description: The new description of the study room
 *         category:
 *           type: string
 *           description: The category of the study room
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: List of tags for the study room
 *         maxParticipants:
 *           type: integer
 *           minimum: 2
 *           maximum: 50
 *           description: Maximum number of participants
 *         isPrivate:
 *           type: boolean
 *           description: Whether the study room is private
 *       example:
 *         title: "New Study Room Title"
 *         description: "A detailed description of the study room"
 *         category: "Math"
 *         tags: ["algebra", "geometry"]
 *         maxParticipants: 20
 *         isPrivate: false
 */
export const updateStudyRoomSchema = z.object({
  body: z
    .object({
      title: z
        .string()
        .min(5, 'Title must be at least 5 characters.')
        .optional(),
      description: z
        .string()
        .min(10, 'Description must be at least 10 characters.')
        .optional(),
      category: z.string().min(1).optional(),
      tags: z.array(z.string()).optional(),
      maxParticipants: z.number().int().min(2).max(50).optional(),
      isPrivate: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided for an update.',
    }),

  params: z.object({ roomId: z.uuid() }),
});
export type UpdateStudyRoomDto = z.infer<
  typeof updateStudyRoomSchema.shape.body
>;

/**
 * @openapi
 * components:
 *   parameters:
 *     RoomIdParam:
 *       name: roomId
 *       in: path
 *       required: true
 *       description: The unique ID of the study room
 *       schema:
 *         type: string
 *         format: uuid
 */
export const roomParamsSchema = z.object({
  params: z.object({ roomId: z.uuid() }),
});

/**
 * @openapi
 * components:
 *   parameters:
 *     ListStudyRoomsQuery:
 *       name: query
 *       in: query
 *       required: false
 *       description: Search term to filter study rooms
 *       schema:
 *         type: string
 *     ListStudyRoomsTopic:
 *       name: topic
 *       in: query
 *       required: false
 *       description: Topic of the study room
 *       schema:
 *         type: string
 *     ListStudyRoomsLimit:
 *       name: limit
 *       in: query
 *       required: false
 *       description: Maximum number of rooms to return (default 9, max 20)
 *       schema:
 *         type: integer
 *         minimum: 1
 *         maximum: 20
 *         default: 9
 *     ListStudyRoomsCursor:
 *       name: cursor
 *       in: query
 *       required: false
 *       description: UUID of the last item from previous page for pagination
 *       schema:
 *         type: string
 *         format: uuid
 */
export const listStudyRoomsSchema = z.object({
  query: z.object({
    query: z.string().optional(),
    topic: z.string().optional(),
    limit: z.coerce.number().int().min(1).max(20).default(9),
    cursor: z.uuid().optional(),
  }),
});
