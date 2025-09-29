import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  inArray,
  lt,
  not,
  sql,
} from 'drizzle-orm';

import { DatabaseError } from 'pg';
import { db } from '..';
import { BadRequestError } from '../../errors';
import { ConflictError } from '../../errors/conflic-error';
import { GetEventsSchema, UpdateEventDto } from '../../schemas';
import { Event, eventAttendees, events, EventType, NewEvent } from '../schema';

export class EventRepository {
  /**
   * Finds events from the database based on provided filters.
   * @param options - Query options for filtering events
   * @param options.q - Optional search string to match against event titles
   * @param options.type - Optional event type (`EventType` or "all")
   * @param options.limit - Maximum number of events to return
   * @param options.cursor - Optional event ID used for cursor-based pagination
   * @returns A list of events with host info and attendee counts
   */
  public static async findEvents(options: GetEventsSchema['query']) {
    const { q, type, limit, cursor } = options;

    const conditions = [];

    if (q) {
      conditions.push(ilike(events.title, `%${q}%`));
    }

    if (type && type !== 'all') {
      conditions.push(eq(events.type, type as EventType));
    }

    if (cursor) {
      const cursorItem = await db.query.events.findFirst({
        where: eq(events.id, cursor),
        columns: { createdAt: true },
      });
      if (cursorItem) {
        conditions.push(lt(events.createdAt, cursorItem.createdAt));
      }
    }

    const results = await db.query.events.findMany({
      where: and(...conditions),
      orderBy: [desc(events.isLive), asc(events.date)],
      limit,
      with: { host: { columns: { name: true } } },
    });

    const eventIds = results.map((r) => r.id);
    const attendeeCounts = await db
      .select({ eventId: eventAttendees.eventId, count: count() })
      .from(eventAttendees)
      .where(inArray(eventAttendees.eventId, eventIds))
      .groupBy(eventAttendees.eventId);

    const countMap = new Map(attendeeCounts.map((c) => [c.eventId, c.count]));

    return results.map((r) => ({ ...r, attendees: countMap.get(r.id) || 0 }));
  }

  /**
   * Creates a new event for a given host.
   * @param data - The event details to create.
   * @param hostId - The ID of the host creating the event.
   * @returns  The newly created event.
   */
  public static async create(data: NewEvent, hostId: string): Promise<Event> {
    return db.transaction(async (tx) => {
      const existingEvent = await tx
        .select()
        .from(events)
        .where(
          and(
            eq(events.hostId, hostId),
            eq(events.title, data.title),
            eq(events.date, data.date)
          )
        )
        .limit(1);

      if (existingEvent.length > 0) {
        throw new ConflictError(
          'You already have an event with this title scheduled for the same date and time.'
        );
      }

      const concurrentEventsCount = await tx
        .select({ count: sql<number>`count(*)` })
        .from(events)
        .where(and(eq(events.hostId, hostId), eq(events.date, data.date)));

      if (concurrentEventsCount[0].count >= 3) {
        throw new BadRequestError(
          'You cannot create more than 3 events on the same date.'
        );
      }

      const [newEvent] = await tx.insert(events).values(data).returning();

      await tx.insert(eventAttendees).values({
        eventId: newEvent.id,
        userId: hostId,
      });

      return newEvent;
    });
  }

  /**
   * Updates an event with the given ID using the provided data.
   * @param eventId - The ID of the event to update
   * @param data - Partial data to update the event with
   * @returns The updated event
   */
  public static async update(
    eventId: string,
    data: Partial<UpdateEventDto>
  ): Promise<Event> {
    const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as any);

    const [updatedEvent] = await db
      .update(events)
      .set({
        ...cleanData,
        updatedAt: new Date(),
      })
      .where(eq(events.id, eventId))
      .returning();

    if (!updatedEvent) {
      throw new Error('Failed to update event');
    }

    return updatedEvent;
  }

  /**
   * Deletes an event by its ID.
   * @param eventId - The ID of the event to delete
   */
  public static async delete(eventId: string): Promise<void> {
    const result = await db
      .delete(events)
      .where(eq(events.id, eventId))
      .returning({ id: events.id });

    if (result.length === 0) {
      throw new Error('Event not found or already deleted');
    }
  }

  /**
   * Finds an event by its ID.
   * @param eventId - The ID of the event to find
   * @returns The event if found, otherwise null
   */
  public static async findById(eventId: string) {
    return db.query.events.findFirst({
      where: eq(events.id, eventId),
    });
  }

  /**
   * Get the number of attendees for a specific event.
   * @param eventId - The ID of the event to count attendees for.
   * @returns The total number of attendees. Returns 0 if none are found.
   */
  public static async getAttendeeCount(eventId: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(eventAttendees)
      .where(eq(eventAttendees.eventId, eventId));

    return result[0]?.count || 0;
  }

  /**
   * Find a duplicate event with the same host, title, and date.
   * Can optionally exclude a specific event ID (useful when updating an event).
   * @param hostId - The ID of the host of the event.
   * @param tring} title - The title of the event.
   * @param date - The date of the event.
   * @param Optional event ID to exclude from search.
   * @returns The duplicate event if found, otherwise `undefined`.
   */
  public static async findDuplicateEvent(
    hostId: string,
    title: string,
    date: Date,
    excludeEventId?: string
  ): Promise<Event | undefined> {
    const conditions = [
      eq(events.hostId, hostId),
      eq(events.title, title),
      sql`DATE(${events.date}) = DATE(${date})`,
    ];

    if (excludeEventId) {
      conditions.push(not(eq(events.id, excludeEventId)));
    }

    return db.query.events.findFirst({
      where: and(...conditions),
    });
  }

  /**
   * Check if a user is the host of a specific event.
   * @param eventId - The ID of the event to check.
   * @param userId - The ID of the user to verify.
   * @returns Returns `true` if the user is the host, otherwise `false`.
   */
  public static async isUserHost(
    eventId: string,
    userId: string
  ): Promise<boolean> {
    const event = await db.query.events.findFirst({
      where: and(eq(events.id, eventId), eq(events.hostId, userId)),
    });

    return !!event;
  }

  /**
   * Get an event by its ID, including the count of attendees.
   * @param eventId - The ID of the event to retrieve.
   * @returns Returns the event object with `attendeeCount` or `null` if not found.
   */
  public static async findByIdWithAttendeeCount(eventId: string) {
    const event = await this.findById(eventId);
    if (!event) return null;

    const attendeeCount = await this.getAttendeeCount(eventId);

    return {
      ...event,
      attendeeCount,
    };
  }

  /**
   * Get all events hosted by a specific user.
   * @param hostId - The ID of the host.
   * @returns Returns an array of events hosted by the user, ordered by creation date descending.
   */
  public static async findByHost(hostId: string): Promise<Event[]> {
    return db.query.events.findMany({
      where: eq(events.hostId, hostId),
      orderBy: (events, { desc }) => [desc(events.createdAt)],
    });
  }

  /**
   * Check if a host has any events that conflict with a given date.
   * Conflicts are defined as events within 2 hours before or after the given date.
   * @param hostId - The ID of the host.
   * @param date - The date to check for conflicts.
   * @param Optional event ID to exclude from conflict check (useful for updates).
   * @returns Returns `true` if there is a conflicting event, otherwise `false`.
   */
  public static async hasConflictingEvent(
    hostId: string,
    date: Date,
    excludeEventId?: string
  ): Promise<boolean> {
    const twoHoursBefore = new Date(date);
    twoHoursBefore.setHours(twoHoursBefore.getHours() - 2);

    const twoHoursAfter = new Date(date);
    twoHoursAfter.setHours(twoHoursAfter.getHours() + 2);

    const conditions = [
      eq(events.hostId, hostId),
      sql`${events.date} BETWEEN ${twoHoursBefore} AND ${twoHoursAfter}`,
    ];

    if (excludeEventId) {
      conditions.push(not(eq(events.id, excludeEventId)));
    }

    const conflictingEvent = await db.query.events.findFirst({
      where: and(...conditions),
    });

    return !!conflictingEvent;
  }

  /**
   * Finds an attendee for a given event.
   * @param The UUID of the event.
   * @param The UUID of the user (attendee).
   * @returns A promise resolving to the attendee record if found, otherwise null.
   */
  public static async findAttendee(eventId: string, userId: string) {
    return db.query.eventAttendees.findFirst({
      where: and(
        eq(eventAttendees.eventId, eventId),
        eq(eventAttendees.userId, userId)
      ),
    });
  }

  /**
   * Adds a new attendee to an event if not already registered.
   * @param The UUID of the event.
   * @param The UUID of the user (attendee).
   * @returns A promise that resolves once the attendee is inserted or skipped if already exists.
   */
  public static async addAttendee(eventId: string, userId: string) {
    try {
      await db.insert(eventAttendees).values({ eventId, userId });
    } catch (error: unknown) {
      if (error instanceof Error && (error as DatabaseError).code === '23505') {
        throw new Error('Already registered');
      }
      throw error;
    }
  }

  /**
   * Checks if a user has a scheduling conflict with another event
   * within 1 hour before or after the given event date.
   * @param userId - The user's UUID.
   * @param e} eventDate - The date of the event to check against.
   * @returns True if there is a conflicting event, false otherwise.
   */
  public static async hasUserEventConflict(
    userId: string,
    eventDate: Date
  ): Promise<boolean> {
    const oneHourBefore = new Date(eventDate);
    oneHourBefore.setHours(oneHourBefore.getHours() - 1);

    const oneHourAfter = new Date(eventDate);
    oneHourAfter.setHours(oneHourAfter.getHours() + 1);

    const conflictingEvent = await db.query.events.findFirst({
      where: and(
        sql`${events.date} BETWEEN ${oneHourBefore} AND ${oneHourAfter}`,
        sql`EXISTS (
        SELECT 1 FROM ${eventAttendees}
        WHERE ${eventAttendees.eventId} = ${events.id}
        AND ${eventAttendees.userId} = ${userId}
      )`
      ),
    });

    return !!conflictingEvent;
  }

  /**
   * Finds an attendee of an event with basic user details.
   * @param eventId - The event's UUID.
   * @param userId - The user's UUID.
   * @returns The attendee record with user info, or null if not found.
   */
  public static async findAttendeeWithDetails(eventId: string, userId: string) {
    return db.query.eventAttendees.findFirst({
      where: and(
        eq(eventAttendees.eventId, eventId),
        eq(eventAttendees.userId, userId)
      ),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  /**
   * Determines if registration is currently open for an event.
   * Registration closes 1 hour before the event start time.
   * @param eventId - The event's UUID.
   * @returns True if registration is open, false otherwise.
   */
  public static async isRegistrationOpen(eventId: string): Promise<boolean> {
    const event = await this.findById(eventId);
    if (!event) return false;

    const now = new Date();
    const eventDate = new Date(event.date);

    const registrationDeadline = new Date(eventDate);
    registrationDeadline.setHours(registrationDeadline.getHours() - 1);

    return now < registrationDeadline && now < eventDate;
  }

  /**
   * Retrieves all attendees of a given event, including basic user details.
   * @param eventId - The event's UUID.
   * @returns A list of attendees with user info.
   */
  public static async getEventAttendees(eventId: string) {
    return db.query.eventAttendees.findMany({
      where: eq(eventAttendees.eventId, eventId),
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  /**
   * Removes an attendee from an event.
   * @param eventId - The event's UUID.
   * @param userId - The user's UUID.
   * @returns Resolves when the attendee is removed.
   */
  public static async removeAttendee(
    eventId: string,
    userId: string
  ): Promise<void> {
    await db
      .delete(eventAttendees)
      .where(
        and(
          eq(eventAttendees.eventId, eventId),
          eq(eventAttendees.userId, userId)
        )
      );
  }
}
