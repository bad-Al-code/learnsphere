import { z } from 'zod';

export const eventTypeEnum = z.enum(['Workshop', 'Competition', 'Networking']);
export type EventType = z.infer<typeof eventTypeEnum>;

export const eventSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  type: eventTypeEnum,
  host: z.string(),
  hostId: z.uuid().nullable(),
  date: z.string(),
  location: z.string(),
  attendees: z.number().int(),
  maxAttendees: z.number().int(),
  tags: z.array(z.string()),
  isLive: z.boolean(),
  prize: z.string().nullable().optional(),
  progress: z.number(),
});

export type TEvent = z.infer<typeof eventSchema>;

export const eventsPaginatedResponseSchema = z.object({
  events: z.array(eventSchema),
  nextCursor: z.uuid().nullable(),
});
export type EventsPaginatedResponse = z.infer<
  typeof eventsPaginatedResponseSchema
>;

export const createEventFormSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  type: eventTypeEnum,
  date: z
    .date({ error: 'Please select a date and time.' })
    .refine((date) => date > new Date(), 'Event date must be in the future.'),
  location: z.string().min(3, 'Location is required.'),
  maxAttendees: z.coerce
    .number()
    .int()
    .min(2, 'Must allow at least 2 attendees.'),
  tags: z.string().optional(),
  prize: z.string().optional(),
});
export type CreateEventInput = z.infer<typeof createEventFormSchema>;

export const updateEventFormSchema = z
  .object({
    title: z
      .string()
      .min(5, 'Title must be at least 5 characters.')
      .max(255, 'Title must not exceed 255 characters.')
      .trim()
      .optional(),
    type: z.enum(['Workshop', 'Competition', 'Networking']).optional(),
    date: z
      .date({
        error: 'Please enter a valid date and time.',
      })
      .refine((date) => date > new Date(), 'Event date must be in the future.')
      .refine((date) => {
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        return date <= oneYearFromNow;
      }, 'Event cannot be scheduled more than 1 year in advance.')
      .optional(),
    location: z
      .string()
      .min(3, 'Location must be at least 3 characters.')
      .max(500, 'Location must not exceed 500 characters.')
      .trim()
      .optional(),
    maxAttendees: z.coerce
      .number({
        error: 'Please enter a valid number.',
      })
      .int('Must be a whole number.')
      .min(2, 'Must allow at least 2 attendees.')
      .max(10000, 'Maximum attendees cannot exceed 10,000.')
      .optional(),
    tags: z.array(z.string()).optional(),
    prize: z
      .string()
      .max(255, 'Prize description must not exceed 255 characters.')
      .trim()
      .optional()
      .transform((prize) => (prize === '' ? undefined : prize)),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'At least one field must be provided for update.',
  });

export type UpdateEventInput = z.infer<typeof updateEventFormSchema>;

export type UpdateEventPayload = {
  title?: string;
  type?: 'Workshop' | 'Competition' | 'Networking';
  date?: string;
  location?: string;
  maxAttendees?: number;
  tags?: string[];
  prize?: string;
};

export const registrationStatusSchema = z.object({
  isRegistered: z.boolean(),
  isHost: z.boolean(),
  isFull: z.boolean(),
  currentAttendees: z.number(),
  maxAttendees: z.number(),
});

export type RegistrationStatus = z.infer<typeof registrationStatusSchema>;

export const registrationResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z
    .object({
      eventId: z.string(),
      eventTitle: z.string(),
      currentAttendees: z.number(),
      maxAttendees: z.number(),
    })
    .optional(),
});

export type RegistrationResponse = z.infer<typeof registrationResponseSchema>;

export const eventAttendeeSchema = z.object({
  user: z.object({
    id: z.uuid(),
    name: z.string().nullable(),
    avatarUrl: z.url().nullable(),
  }),
});

export type EventAttendee = z.infer<typeof eventAttendeeSchema>;
