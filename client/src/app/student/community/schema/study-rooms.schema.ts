import { z } from 'zod';

export const studyRoomSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  subtitle: z.string().nullable(),
  host: z.string(),
  participants: z.number(),
  maxParticipants: z.number().nullable(),
  duration: z.string(),
  tags: z.array(z.string()).nullable(),
  progress: z.number(),
  isLive: z.boolean(),
  isPrivate: z.boolean(),
  hostId: z.uuid().nullable(),
  time: z.string().optional(),
});

export const studyRoomsResponseSchema = z.array(studyRoomSchema);

export type StudyRoom = z.infer<typeof studyRoomSchema>;

export const createStudyRoomFormSchema = z
  .object({
    title: z.string().min(3, 'Title must be at least 3 characters.'),
    description: z.string().min(10, 'Please provide a longer description.'),
    category: z.string({ error: 'Please select a category.' }),
    tags: z.string().optional(),
    maxParticipants: z.coerce.number().int().min(2).max(50),
    sessionType: z.enum(['now', 'later']),
    startTime: z.string().optional(),
    durationInMinutes: z.coerce
      .number()
      .int()
      .positive('Duration must be a positive number.'),
  })
  .refine(
    (data) => {
      if (data.sessionType === 'later' && !data.startTime) return false;
      return true;
    },
    {
      error: 'Please select a start time for a scheduled session.',
      path: ['startTime'],
    }
  );

export type CreateStudyRoomInput = z.infer<typeof createStudyRoomFormSchema>;

export const studyRoomsPaginatedResponseSchema = z.object({
  rooms: z.array(studyRoomSchema),
  nextCursor: z.uuid().nullable(),
});
export type StudyRoomsPaginatedResponse = z.infer<
  typeof studyRoomsPaginatedResponseSchema
>;

export const updateStudyRoomFormSchema = z
  .object({
    title: z.string().min(5, 'Title must be at least 5 characters.').optional(),
    description: z
      .string()
      .min(10, 'Please provide a longer description.')
      .optional(),
    category: z.string().optional(),
    tags: z.string().optional(),
    maxParticipants: z.coerce.number().int().min(2).max(50).optional(),
    isPrivate: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for an update.',
  });

export type UpdateStudyRoomInput = z.infer<typeof updateStudyRoomFormSchema>;
