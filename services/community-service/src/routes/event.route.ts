import { Router } from 'express';

import { EventController } from '../controllers';
import { requireAuth, validateRequest } from '../middlewares';
import {
  createEventSchema,
  eventParamsSchema,
  eventRegisterParamsSchema,
  getEventsSchema,
  updateEventSchema,
} from '../schemas';

const router = Router();

router.use(requireAuth);

/**
 * @openapi
 * /api/community/events:
 *   get:
 *     summary: Get a list of community events
 *     description: Retrieve a paginated list of community events with optional filters.
 *     tags:
 *       - Events
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Search term to filter events by title
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [online, offline, all]
 *         description: Filter events by type
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 9
 *           minimum: 1
 *         description: Maximum number of events to return
 *       - in: query
 *         name: cursor
 *         schema:
 *           type: string
 *         description: Event ID used for cursor-based pagination
 *     responses:
 *       200:
 *         description: A list of community events
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       type:
 *                         type: string
 *                       host:
 *                         type: string
 *                       date:
 *                         type: string
 *                         example: "Sep 29, 2025 • 7:00 PM"
 *                       location:
 *                         type: string
 *                       attendees:
 *                         type: integer
 *                       maxAttendees:
 *                         type: integer
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                       isLive:
 *                         type: boolean
 *                       prize:
 *                         type: string
 *                       progress:
 *                         type: integer
 *                 nextCursor:
 *                   type: string
 *                   nullable: true
 *                   description: The ID of the last event for pagination
 */
router.get('/', validateRequest(getEventsSchema), EventController.getEvents);

/**
 * @openapi
 * /api/community/events:
 *   post:
 *     tags:
 *       - Events
 *     summary: Create a new event
 *     description: Creates a new event for the authenticated user. Validates event date, time, and uniqueness.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEventDto'
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Bad request (invalid date, time, or other validation error)
 *       409:
 *         description: Conflict (event with same title and date already exists)
 *       401:
 *         description: Unauthorized (missing or invalid authentication)
 */
router.post(
  '/',
  validateRequest(createEventSchema),
  EventController.createEvent
);

/**
 * @openapi
 * /api/community/events/{eventId}:
 *   put:
 *     tags:
 *       - Events
 *     summary: Update an event
 *     description: Updates an event if the requester is the host. Requires bearer authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the event to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEvent'
 *     responses:
 *       200:
 *         description: Event successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       403:
 *         description: Forbidden - requester is not the host
 *       404:
 *         description: Event not found
 */
router.put(
  '/:eventId',
  validateRequest(updateEventSchema),
  EventController.updateEvent
);

/**
 * @openapi
 * /api/community/events/{eventId}:
 *   delete:
 *     tags:
 *       - Events
 *     summary: Delete an event
 *     description: Deletes an event if the requester is the host. Requires bearer authentication.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the event to delete
 *     responses:
 *       204:
 *         description: Event successfully deleted
 *       403:
 *         description: Forbidden - requester is not the host
 *       404:
 *         description: Event not found
 */
router.delete(
  '/:eventId',
  validateRequest(eventParamsSchema),
  EventController.deleteEvent
);

/**
 * @openapi
 * /api/community/events/{eventId}/register:
 *   post:
 *     summary: Register the current user for an event
 *     description: Registers the authenticated user as an attendee for the specified event.
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The UUID of the event to register for.
 *     responses:
 *       200:
 *         description: Successfully registered for the event.
 *       400:
 *         description: The event is full or request is invalid.
 *       404:
 *         description: The event was not found.
 *       409:
 *         description: User is already registered for the event.
 */
router.post(
  '/:eventId/register',
  validateRequest(eventRegisterParamsSchema),
  EventController.registerForEvent
);

/**
 * @openapi
 * /api/community/events/{eventId}/register:
 *   delete:
 *     summary: Unregister the current user from an event
 *     description: Removes the authenticated user from the attendee list of the specified event.
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The UUID of the event to unregister from.
 *     responses:
 *       200:
 *         description: Successfully unregistered from the event.
 *       400:
 *         description: Invalid request (e.g., event has started, or host tries to unregister).
 *       404:
 *         description: Event not found or user was not registered.
 */
router.delete(
  '/:eventId/register',
  validateRequest(eventRegisterParamsSchema),
  EventController.unregisterFromEvent
);

/**
 * @openapi
 * /api/community/events/{eventId}/registration-status:
 *   get:
 *     summary: Get the registration status of the current user for an event
 *     description: Returns whether the authenticated user is registered, is the host, or if the event is full.
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The UUID of the event to check status for.
 *     responses:
 *       200:
 *         description: Registration status retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isRegistered:
 *                   type: boolean
 *                   description: Whether the user is registered or is the host.
 *                 isHost:
 *                   type: boolean
 *                   description: Whether the user is the host of the event.
 *                 isFull:
 *                   type: boolean
 *                   description: Whether the event has reached its attendee limit.
 *                 currentAttendees:
 *                   type: integer
 *                   description: Current number of attendees.
 *                 maxAttendees:
 *                   type: integer
 *                   description: Maximum number of attendees allowed.
 *       404:
 *         description: Event not found.
 */
router.get(
  '/:eventId/registration-status',
  validateRequest(eventRegisterParamsSchema),
  EventController.getRegistrationStatus
);

/**
 * @openapi
 * /api/community/events/{eventId}/attendees:
 *   get:
 *     tags:
 *       - Events
 *     summary: Get attendees for a specific event
 *     description: Retrieves a list of attendees for the specified event.
 *                  Only users registered for the event can access this endpoint.
 *     parameters:
 *       - name: eventId
 *         in: path
 *         description: The ID of the event to fetch attendees for.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of attendees for the event.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *       403:
 *         description: Forbidden. The requester is not registered for the event.
 *       400:
 *         description: Bad request. Invalid eventId.
 *       500:
 *         description: Internal server error.
 */
router.get(
  '/:eventId/attendees',
  validateRequest(eventParamsSchema),
  EventController.getEventAttendees
);

export { router as eventRouter };
