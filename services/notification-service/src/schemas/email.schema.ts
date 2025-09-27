import { z } from 'zod';

export const emailInviteSchema = z.object({
  body: z.object({
    emails: z
      .array(z.string().email())
      .min(1, 'At least one email is required.'),
    subject: z.string().min(1, 'Subject is required.'),
    message: z.string().min(1, 'Message is required.'),
    linkUrl: z.string().url(),
  }),
});

export const bulkInviteSchema = z.object({
  body: z.object({
    contacts: z
      .array(
        z.object({
          name: z.string(),
          email: z.string().email(),
        })
      )
      .min(1, 'At least one contact is required.'),
    subject: z.string().min(1, 'Subject is required.'),
    message: z.string().min(1, 'Message is required.'),
    linkUrl: z.string().url(),
  }),
});
