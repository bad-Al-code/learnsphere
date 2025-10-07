import { z } from 'zod';

export const mentorshipProgramSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  mentorName: z.string(),
  mentorInitials: z.string(),
  mentorRole: z.string().nullable(),
  mentorBio: z.string().nullable(),
  rating: z.number(),
  reviews: z.number(),
  experience: z.number(),
  duration: z.string(),
  commitment: z.string(),
  nextCohort: z.string(),
  price: z.string(),
  focusAreas: z.array(z.string()),
  spotsFilled: z.number(),
  totalSpots: z.number(),
  isFavorite: z.boolean(),
  likes: z.number(),
  status: z.enum(['open', 'filling-fast', 'full']),
});

export type TMentorshipProgram = z.infer<typeof mentorshipProgramSchema>;

export const mentorshipsPaginatedResponseSchema = z.object({
  programs: z.array(mentorshipProgramSchema),
  nextCursor: z.uuid().nullable(),
});

export type MentorshipPaginatedResponse = z.infer<
  typeof mentorshipsPaginatedResponseSchema
>;
