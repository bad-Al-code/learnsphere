import { z } from 'zod';

export const joinWaitlistSchema = z.object({
  email: z.email({ message: 'Please enter a valid email address.' }),
  referredByCode: z.string().optional().nullable(),
});

export type JoinWaitlistInput = z.infer<typeof joinWaitlistSchema>;

export const updateInterestsSchema = z.object({
  interests: z
    .array(z.string())
    .min(1, 'Please select at least one interest to continue.'),
});
export type UpdateInterestsInput = z.infer<typeof updateInterestsSchema>;

export const waitlistEntrySchema = z.object({
  id: z.uuid(),
  email: z.email(),
  createdAt: z.iso.datetime(),
});
export type WaitlistEntry = z.infer<typeof waitlistEntrySchema>;

export const joinWaitlistResponseSchema = z.object({
  success: z.boolean(),
  data: waitlistEntrySchema,
  message: z.string(),
});
export type JoinWaitlistResponse = z.infer<typeof joinWaitlistResponseSchema>;

export const waitlistStatusSchema = z.object({
  waitlistPosition: z.number().int(),
  referralCount: z.number().int(),
  referralCode: z.string(),
  rewardsUnlocked: z.array(z.string()),
});
export type WaitlistStatus = z.infer<typeof waitlistStatusSchema>;

export const waitlistStatusResponseSchema = z.object({
  success: z.boolean(),
  data: waitlistStatusSchema,
});
export type WaitlistStatusResponse = z.infer<
  typeof waitlistStatusResponseSchema
>;

export const waitlistErrorResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  errors: z
    .array(
      z.object({
        message: z.string(),
        field: z.string().optional(),
      })
    )
    .optional(),
});

export type WaitlistErrorResponse = z.infer<typeof waitlistErrorResponseSchema>;
