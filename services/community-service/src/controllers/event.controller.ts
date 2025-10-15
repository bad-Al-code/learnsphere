import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { EventRepository } from '../db/repositories';
import { NotAuthorizedError } from '../errors';
import {
  createEventSchema,
  eventParamsSchema,
  eventRegisterParamsSchema,
  getEventsSchema,
  updateEventSchema,
} from '../schemas';
import { EventService } from '../services/event.service';

export class EventController {
  public static async getEvents(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { query } = getEventsSchema.parse(req);

      const result = await EventService.getEvents(query, req.currentUser);

      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  public static async getEventAttendees(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { params } = eventParamsSchema.parse({ params: req.params });
      const { eventId } = params;

      const attendees = await EventService.getEventAttendees(
        eventId,
        req.currentUser
      );

      res.status(StatusCodes.OK).json(attendees);
    } catch (error) {
      next(error);
    }
  }

  public static async createEvent(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();

      const { body } = createEventSchema.parse({ body: req.body });
      const newEvent = await EventService.createEvent(body, req.currentUser);

      res.status(StatusCodes.CREATED).json({
        success: true,
        data: newEvent,
        message: 'Event created successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateEvent(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();

      const { params } = eventParamsSchema.parse({ params: req.params });
      const { eventId } = params;

      const { body } = updateEventSchema.parse({ body: req.body, params });
      if (Object.keys(body).length === 0) {
        res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          error: 'At least one field must be provided for update.',
        });
        return;
      }

      const updatedEvent = await EventService.updateEvent(
        eventId,
        body,
        req.currentUser
      );

      res.status(StatusCodes.OK).json({
        success: true,
        data: updatedEvent,
        message: 'Event updated successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteEvent(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { params } = eventParamsSchema.parse({ params: req.params });
      const { eventId } = params;
      // const confirmationToken = req.headers['x-confirmation-token'];
      // if (!confirmationToken) {
      //   return res.status(StatusCodes.BAD_REQUEST).json({
      //     success: false,
      //     error: 'Deletion confirmation required.',
      //   });
      // }

      await EventService.deleteEvent(eventId, req.currentUser);

      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }

  public static async registerForEvent(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();
      const { params } = eventRegisterParamsSchema.parse({
        params: req.params,
      });
      const { eventId } = params;

      const event = await EventRepository.findById(eventId);
      if (!event) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          error: 'Event not found.',
        });
      }

      await EventService.registerForEvent(eventId, req.currentUser);

      const attendeeCount = await EventRepository.getAttendeeCount(eventId);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Successfully registered for the event.',
        data: {
          eventId,
          eventTitle: event.title,
          currentAttendees: attendeeCount,
          maxAttendees: event.maxAttendees,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public static async unregisterFromEvent(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();

      const { params } = eventRegisterParamsSchema.parse({
        params: req.params,
      });

      await EventService.unregisterFromEvent(params.eventId, req.currentUser);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Successfully unregistered from the event.',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getRegistrationStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();

      const { params } = eventRegisterParamsSchema.parse({
        params: req.params,
      });

      const status = await EventService.checkRegistrationStatus(
        params.eventId,
        req.currentUser
      );

      res.status(StatusCodes.OK).json({
        success: true,
        data: status,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getMyUpcomingEvents(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();

      const events = await EventService.getUpcomingEventsForUser(
        req.currentUser
      );

      res.status(StatusCodes.OK).json(events);
    } catch (error) {
      next(error);
    }
  }
}
