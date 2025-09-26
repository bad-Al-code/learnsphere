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
  time: z.string().optional(),
});

export const studyRoomsResponseSchema = z.array(studyRoomSchema);

export type StudyRoom = z.infer<typeof studyRoomSchema>;
