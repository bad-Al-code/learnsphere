import { z } from 'zod';
import { Event, EventType, eventTypeEnum } from '../db/schema';

/**
 * @openapi
 * components:
 *   schemas:
 *     GetEventsQuery:
 *       type: object
 *       properties:
 *         q:
 *           type: string
 *           description: Search term to filter events by title.
 *         type:
 *           type: string
 *           enum: [online, offline, all]
 *           description: Filter events by type. Defaults to all if not provided.
 *         limit:
 *           type: integer
 *           default: 9
 *           minimum: 1
 *           description: Maximum number of events to return.
 *         cursor:
 *           type: string
 *           description: Event ID used for cursor-based pagination.
 *       example:
 *         q: "hackathon"
 *         type: "online"
 *         limit: 10
 *         cursor: "event_uuid_here"
 */
export const eventTypeSchema = z.enum(
  eventTypeEnum.enumValues as [EventType, ...EventType[]]
);

/**
 * @openapi
 * components:
 *   schemas:
 *     GetEventsQuery:
 *       type: object
 *       properties:
 *         q:
 *           type: string
 *           description: Optional search keyword to filter events by title.
 *           example: "coding"
 *         type:
 *           type: string
 *           enum: [Workshop, Competition, Networking, all]
 *           description: Filter events by type (or use "all" for no filtering).
 *           example: Workshop
 *         limit:
 *           type: integer
 *           minimum: 1
 *           description: Number of events to return (defaults to 9).
 *           example: 10
 *         cursor:
 *           type: string
 *           description: Event ID used for pagination (fetch events created before this one).
 *           example: "5cd028a2-7e04-47fb-9002-ebb9af4ab534"
 */
export const getEventsSchema = z.object({
  query: z.object({
    q: z
      .string()
      .optional()
      .transform((val) => val?.trim()),
    type: eventTypeSchema.or(z.literal('all')).optional(),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : 9))
      .refine((val) => !isNaN(val) && val > 0, {
        message: 'Limit must be a positive number',
      }),
    cursor: z.string().optional(),
  }),
});

export type GetEventsSchema = z.infer<typeof getEventsSchema>;

export type EventWithAttendees = Event & {
  attendees: number;
  host: { name: string | null };
};

/**
 * @openapi
 * components:
 *   schemas:
 *     CreateEventDto:
 *       type: object
 *       required:
 *         - title
 *         - type
 *         - date
 *         - location
 *         - maxAttendees
 *       properties:
 *         title:
 *           type: string
 *           minLength: 5
 *           maxLength: 255
 *           description: The title of the event.
 *           example: "Live Coding Session: Building a Trello Clone"
 *         type:
 *           type: string
 *           enum: [Workshop, Competition, Networking]
 *           description: The type of event.
 *           example: Workshop
 *         date:
 *           type: string
 *           format: date-time
 *           description: Event date (must be in the future).
 *           example: "2025-10-15T18:00:00Z"
 *         location:
 *           type: string
 *           minLength: 3
 *           maxLength: 500
 *           description: The location of the event.
 *           example: "San Francisco, CA"
 *         maxAttendees:
 *           type: integer
 *           minimum: 2
 *           maximum: 10000
 *           description: Maximum number of attendees.
 *           example: 200
 *         tags:
 *           type: array
 *           maxItems: 10
 *           description: List of tags for the event.
 *           items:
 *             type: string
 *           example: ["tech", "coding", "react"]
 *         prize:
 *           type: string
 *           maxLength: 255
 *           description: Prize description if available.
 *           example: "MacBook Pro for the winner"
 */
export const createEventSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(5, 'Title must be at least 5 characters.')
      .max(255, 'Title must not exceed 255 characters.')
      .trim(),
    type: z.enum(eventTypeEnum.enumValues),
    date: z.iso
      .datetime()
      .transform((val) => new Date(val))
      .refine(
        (date) => new Date(date) > new Date(),
        'Event date must be in the future.'
      ),
    location: z
      .string()
      .min(3, 'Location must be at least 3 characters.')
      .max(500, 'Location must not exceed 500 characters.')
      .trim(),
    maxAttendees: z.coerce
      .number()
      .int()
      .min(2, 'Event must allow at least 2 attendees.')
      .max(10000, 'Maximum attendees cannot exceed 10,000.'),
    tags: z
      .array(z.string().trim().min(1))
      .max(10, 'Maximum 10 tags allowed.')
      .optional(),
    prize: z
      .string()
      .max(255, 'Prize description must not exceed 255 characters.')
      .trim()
      .optional(),
  }),
});

export type CreateEventDto = z.infer<typeof createEventSchema.shape.body>;

/**
 * @openapi
 * components:
 *   schemas:
 *     EventParams:
 *       type: object
 *       properties:
 *         eventId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier of the event
 *       required:
 *         - eventId
 */
export const eventParamsSchema = z.object({
  params: z.object({
    eventId: z.uuid(),
  }),
});

/**
 * @openapi
 * components:
 *   schemas:
 *     UpdateEvent:
 *       type: object
 *       properties:
 *         body:
 *           type: object
 *           description: Fields to update in the event
 *           example:
 *             name: "Updated Event Name"
 *             date: "2025-10-01T12:00:00Z"
 *         params:
 *           $ref: '#/components/schemas/EventParams'
 *       required:
 *         - body
 *         - params
 */
export const updateEventSchema = z.object({
  body: createEventSchema.shape.body
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: 'At least one field must be provided for an update.',
    }),
  params: eventParamsSchema.shape.params,
});

export type UpdateEventDto = z.infer<typeof updateEventSchema.shape.body>;

/**
 * @openapi
 * components:
 *   schemas:
 *     EventRegisterParams:
 *       type: object
 *       properties:
 *         params:
 *           type: object
 *           properties:
 *             eventId:
 *               type: string
 *               format: uuid
 *       required:
 *         - params
 *       example:
 *         params:
 *           eventId: "550e8400-e29b-41d4-a716-446655440000"
 */
export const eventRegisterParamsSchema = z.object({
  params: z.object({
    eventId: z.uuid(),
  }),
});
