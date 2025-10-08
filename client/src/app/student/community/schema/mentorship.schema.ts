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

export const becomeMentorFormSchema = z.object({
  expertise: z
    .string()
    .min(1, 'Expertise is required.')
    .min(
      10,
      'Please provide more detail about your expertise (at least 10 characters).'
    )
    .max(1000, 'Expertise description is too long (max 1000 characters).')
    .refine(
      (val) => val.trim().split(/\s+/).length >= 5,
      'Please provide a more detailed description (at least 5 words).'
    )
    .refine(
      (val) => val.trim().length >= 10,
      'Please avoid using only spaces.'
    ),
  experience: z.string().min(1, 'Please select your years of experience.'),
  availability: z.string().min(1, 'Please select your weekly availability.'),
});

export type BecomeMentorInput = z.infer<typeof becomeMentorFormSchema>;

export interface MentorshipStatusResponse {
  hasApplication: boolean;
  status?: 'pending' | 'approved' | 'rejected';
  applicationId?: string;
  submittedAt?: string;
}

export interface MentorshipStatusApiResponse {
  success: boolean;
  data: MentorshipStatusResponse;
}
