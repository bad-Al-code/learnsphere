import { z } from 'zod';

export const liveActivityItemSchema = z.object({
  id: z.uuid(),
  userName: z.string(),
  userAvatar: z.url().nullable(),
  actionText: z.string(),
  subject: z.string(),
  timestamp: z.iso.datetime(),
  type: z.string(),
});
export type LiveActivityItem = z.infer<typeof liveActivityItemSchema>;

export const studyGroupParticipantSchema = z.object({
  name: z.string(),
  avatarUrl: z.url().nullable(),
});

export const studyGroupSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string(),
  isLive: z.boolean(),
  category: z.string(),
  participants: z.array(studyGroupParticipantSchema),
  participantCount: z.number(),
  maxParticipants: z.number(),
  duration: z.string(),
  startTime: z.string(),
});
export type StudyGroup = z.infer<typeof studyGroupSchema>;
