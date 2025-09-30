import { differenceInMilliseconds } from 'date-fns';
import { DatabaseError } from 'pg';
import logger from '../config/logger';
import { EventRepository } from '../db/repositories/event.repository';
import { Event } from '../db/schema';
import { BadRequestError, ForbiddenError, NotFoundError } from '../errors';
import { ConflictError } from '../errors/conflic-error';
import {
  EventReminderPublisher,
  EventUserRegisteredPublisher,
  EventUserUnregisteredPublisher,
} from '../events/publisher';
import { CreateEventDto, GetEventsSchema, UpdateEventDto } from '../schemas';
import { Requester } from '../types';

export class EventService {
  /**
   * Retrieves and formats a list of events with pagination support.
   * @param options - Query options for fetching events
   * @param options.query - Optional search string to filter events by title
   * @param options.type - Optional event type (e.g., "online", "offline", "all")
   * @param options.limit - Maximum number of events to return
   * @param options.cursor - Optional event ID for cursor-based pagination
   * @returns An object containing:
   * - events: A list of formatted events with host info, attendees, progress, etc.
   * - nextCursor: The ID of the last event in the current batch (for pagination), or null if none
   */
  public static async getEvents(
    options: GetEventsSchema['query'],
    requester: Requester
  ) {
    const limit = options.limit || 9;
    const offset = options.cursor ? parseInt(options.cursor, 10) : 0;

    const eventData = await EventRepository.findEvents(
      {
        ...options,
        limit: limit + 1,
      },
      requester.id
    );

    const hasMore = eventData.length > limit;
    const events = hasMore ? eventData.slice(0, limit) : eventData;

    const nextCursor = hasMore ? String(offset + limit) : null;

    const formattedEvents = events.map((event) => {
      const now = new Date();
      const eventDate = new Date(event.date);
      const isPast = eventDate < now;

      return {
        id: event.id,
        title: event.title,
        type: event.type,
        host: `Hosted By ${event.host.name}`,
        hostId: event.hostId,
        date: event.date,
        location: event.location,
        attendees: event.attendees,
        maxAttendees: event.maxAttendees,
        tags: event.tags || [],
        isLive: event.isLive && !isPast,
        prize: event.prize,
        progress: Math.round((event.attendees / event.maxAttendees) * 100),
      };
    });

    return { events: formattedEvents, nextCursor };
  }

  /**
   * Retrieves the list of attendees for a specific event.
   * Only allows access if the requester is registered for the event.
   * @param eventId - The ID of the event to fetch attendees for.
   * @param requester - The user making the request.
   * @returns A promise that resolves to the list of event attendees.
   */
  public static async getEventAttendees(eventId: string, requester: Requester) {
    const isRegistered = await EventRepository.findAttendee(
      eventId,
      requester.id
    );
    if (!isRegistered) {
      throw new ForbiddenError();
    }

    return EventRepository.getEventAttendees(eventId);
  }

  /**
   * Creates a new event for the requesting user.
   * @param data - The input data for the new event.
   * @param requester - The user creating the event (host).
   * @returns  The newly created event.
   */
  public static async createEvent(
    data: CreateEventDto,
    requester: Requester
  ): Promise<Event> {
    const eventDate = new Date(data.date);
    const now = new Date();

    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(now.getFullYear() + 1);

    if (eventDate > oneYearFromNow) {
      throw new BadRequestError(
        'Events cannot be scheduled more than 1 year in advance.'
      );
    }

    const hour = eventDate.getHours();
    if (hour < 6 || hour > 23) {
      throw new BadRequestError(
        'Events can only be scheduled between 6 AM and 11 PM.'
      );
    }

    try {
      const newEvent = await EventRepository.create(
        {
          ...data,
          hostId: requester.id,
          date: eventDate,
          tags: data.tags || [],
        },
        requester.id
      );

      return newEvent;
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('unique_user_title_date')
      ) {
        throw new ConflictError(
          'You already have an event with this title scheduled for the same date and time.'
        );
      }
      throw error;
    }
  }

  /**
   * Updates an event if the requester is the host.
   * @param eventId - The ID of the event to update
   * @param data - Data to update the event with
   * @param requester - The user attempting the update
   */
  public static async updateEvent(
    eventId: string,
    data: UpdateEventDto,
    requester: Requester
  ): Promise<Event> {
    const event = await EventRepository.findById(eventId);
    if (!event || event.hostId !== requester.id) {
      throw new ForbiddenError();
    }

    const now = new Date();
    const eventDate = new Date(event.date);

    if (eventDate < now) {
      throw new BadRequestError(
        'Cannot update an event that has already passed.'
      );
    }

    if (event.isLive) {
      throw new BadRequestError(
        'Cannot update an event that is currently live.'
      );
    }

    if (data.maxAttendees !== undefined) {
      const currentAttendeeCount =
        await EventRepository.getAttendeeCount(eventId);

      if (data.maxAttendees < currentAttendeeCount) {
        throw new BadRequestError(
          `Maximum attendees (${data.maxAttendees}) cannot be less than current registered attendees (${currentAttendeeCount}).`
        );
      }

      if (data.maxAttendees > 10000) {
        throw new BadRequestError('Maximum attendees cannot exceed 10,000.');
      }
    }

    if (data.date) {
      const newDate = new Date(data.date);

      if (newDate <= now) {
        throw new BadRequestError('Event date must be in the future.');
      }

      const oneYearFromNow = new Date(now);
      oneYearFromNow.setFullYear(now.getFullYear() + 1);

      if (newDate > oneYearFromNow) {
        throw new BadRequestError(
          'Events cannot be scheduled more than 1 year in advance.'
        );
      }

      const oneHourFromNow = new Date(now);
      oneHourFromNow.setHours(now.getHours() + 1);

      if (newDate < oneHourFromNow) {
        throw new BadRequestError(
          'Event must be scheduled at least 1 hour in advance.'
        );
      }
    }

    if (data.title || data.date) {
      const checkTitle = data.title || event.title;
      const checkDate = data.date ? new Date(data.date) : new Date(event.date);

      const duplicate = await EventRepository.findDuplicateEvent(
        requester.id,
        checkTitle,
        checkDate,
        eventId
      );

      if (duplicate) {
        throw new ConflictError(
          'You already have an event with this title scheduled for the same date and time.'
        );
      }
    }

    if (data.location !== undefined && data.location.trim().length < 3) {
      throw new BadRequestError('Location must be at least 3 characters.');
    }

    const updatedEvent = await EventRepository.update(eventId, {
      ...data,
      date: data.date ? new Date(data.date) : undefined,
    });

    return updatedEvent;
  }

  /**
   * Deletes an event if the requester is the host.
   * @param eventId - The ID of the event to delete
   * @param requester - The user attempting the deletion
   */
  public static async deleteEvent(
    eventId: string,
    requester: Requester
  ): Promise<void> {
    const event = await EventRepository.findById(eventId);

    if (!event) {
      throw new NotFoundError('Event');
    }

    if (event.hostId !== requester.id) {
      throw new ForbiddenError('You can only delete events that you created.');
    }

    if (event.isLive) {
      throw new BadRequestError(
        'Cannot delete an event that is currently live. Please end the event first.'
      );
    }

    const now = new Date();
    const eventDate = new Date(event.date);

    if (eventDate < now) {
      throw new BadRequestError(
        'Cannot delete an event that has already started or passed.'
      );
    }

    const attendeeCount = await EventRepository.getAttendeeCount(eventId);

    if (attendeeCount > 50) {
      throw new BadRequestError(
        `This event has ${attendeeCount} registered attendees. Please contact support to delete events with more than 50 attendees.`
      );
    }

    logger.info(
      `Event deletion: ${eventId} by user ${requester.id} with ${attendeeCount} attendees`
    );

    await EventRepository.delete(eventId);
  }

  /**
   * Registers a requester for an event.
   * @param The UUID of the event.
   * @param The requester object containing the user ID.
   * @throws If the event does not exist.
   * @throws If the event is already full.
   * @returns A promise that resolves once registration is complete.
   */
  public static async registerForEvent(eventId: string, requester: Requester) {
    const event = await EventRepository.findById(eventId);
    if (!event) {
      throw new NotFoundError('Event');
    }

    const now = new Date();
    const eventDate = new Date(event.date);
    if (eventDate < now) {
      throw new BadRequestError(
        'Cannot register for an event that has already passed.'
      );
    }

    const oneHourBeforeEvent = new Date(eventDate);
    oneHourBeforeEvent.setHours(oneHourBeforeEvent.getHours() - 1);
    if (now > oneHourBeforeEvent) {
      throw new BadRequestError('Registration has closed for this event.');
    }

    const isAlreadyRegistered = await EventRepository.findAttendee(
      eventId,
      requester.id
    );
    if (isAlreadyRegistered) {
      throw new ConflictError('You are already registered for this event.');
    }

    const currentAttendeeCount =
      await EventRepository.getAttendeeCount(eventId);
    if (currentAttendeeCount >= event.maxAttendees) {
      throw new BadRequestError('This event is already full.');
    }
    if (event.hostId === requester.id) {
      throw new BadRequestError(
        'As the host, you are already registered for this event.'
      );
    }

    const hasConflict = await EventRepository.hasUserEventConflict(
      requester.id,
      eventDate
    );
    if (hasConflict) {
      throw new BadRequestError(
        'You have another event scheduled at the same time.'
      );
    }

    try {
      await EventRepository.addAttendee(eventId, requester.id);
    } catch (error: unknown) {
      const dbError = error as DatabaseError;
      if (dbError.code === '23505') {
        throw new ConflictError('You are already registered for this event.');
      }
      throw error;
    }

    logger.info(
      `User ${requester.id} successfully registered for event ${eventId}`
    );

    const newEvent = await EventRepository.findById(eventId);
    if (newEvent) {
      const regPublisher = new EventUserRegisteredPublisher();
      await regPublisher.publish({
        eventId: newEvent.id,
        userId: requester.id,
        eventTitle: newEvent.title,
        eventDate: newEvent.date.toISOString(),
      });

      const oneHourBefore = new Date(newEvent.date).getTime() - 60 * 60 * 1000;
      const delay = differenceInMilliseconds(oneHourBefore, new Date());

      if (delay > 0) {
        const reminderPublisher = new EventReminderPublisher();
        await reminderPublisher.publish(
          {
            eventId: event.id,
            userId: requester.id,
            eventTitle: event.title,
            eventDate: event.date.toISOString(),
          },
          { expiration: delay }
        );
      }
    }
  }

  /**
   * Unregisters the requester from an event.
   * @param eventId - The UUID of the event.
   * @param requester - The requester attempting to unregister.
   * @returns Resolves when the user is successfully unregistered.
   */
  public static async unregisterFromEvent(
    eventId: string,
    requester: Requester
  ) {
    const event = await EventRepository.findById(eventId);
    if (!event) {
      throw new NotFoundError('Event not found.');
    }

    if (event.hostId === requester.id) {
      throw new BadRequestError(
        'Event hosts cannot unregister from their own events.'
      );
    }

    if (new Date(event.date) < new Date()) {
      throw new BadRequestError(
        'Cannot unregister from an event that has already started.'
      );
    }

    const attendee = await EventRepository.findAttendee(eventId, requester.id);
    if (!attendee) {
      throw new NotFoundError('You are not registered for this event.');
    }

    await EventRepository.removeAttendee(eventId, requester.id);
    logger.info(
      `User ${requester.id} successfully unRegistered for event ${eventId}`
    );

    const newEvent = await EventRepository.findById(eventId);
    if (newEvent) {
      const publisher = new EventUserUnregisteredPublisher();
      await publisher.publish({
        eventId: newEvent.id,
        userId: requester.id,
        eventTitle: newEvent.title,
      });
    }
  }

  /**
   * Checks the registration status of the requester for a given event.
   * @param eventId - The UUID of the event.
   * @param requester - The requester whose status is being checked.
   * @returns An object describing the requester's registration status and event capacity details.
   */
  public static async checkRegistrationStatus(
    eventId: string,
    requester: Requester
  ) {
    const event = await EventRepository.findById(eventId);
    if (!event) {
      throw new NotFoundError('Event not found.');
    }

    const isRegistered = await EventRepository.findAttendee(
      eventId,
      requester.id
    );
    const attendeeCount = await EventRepository.getAttendeeCount(eventId);
    const isHost = event.hostId === requester.id;

    return {
      isRegistered: !!isRegistered || isHost,
      isHost,
      isFull: attendeeCount >= event.maxAttendees,
      currentAttendees: attendeeCount,
      maxAttendees: event.maxAttendees,
    };
  }
}
