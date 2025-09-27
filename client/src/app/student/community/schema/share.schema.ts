import { z } from 'zod';

export const expirationOptionsSchema = z.enum([
  '1hour',
  '24hours',
  '7days',
  'never',
]);
export type ExpirationOption = z.infer<typeof expirationOptionsSchema>;

export const generateShareLinkInputSchema = z.object({
  roomId: z.uuid(),
  expiresIn: expirationOptionsSchema,
});
export type GenerateShareLinkInput = z.infer<
  typeof generateShareLinkInputSchema
>;

export const generateShareLinkResponseSchema = z.object({
  shareLink: z.url(),
});

export const emailInviteFormSchema = z.object({
  emails: z.string().min(1, 'Please enter at least one email address.'),
  subject: z.string().min(1, 'Subject cannot be empty.'),
  message: z.string().min(1, 'Message cannot be empty.'),
});
export type EmailInviteInput = z.infer<typeof emailInviteFormSchema>;

export const searchedUserSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  email: z.email(),
});
export type SearchedUser = z.infer<typeof searchedUserSchema>;

export const inviteUsersInputSchema = z.object({
  roomId: z.uuid(),
  userIds: z.array(z.uuid()).min(1),
});
export type InviteUsersInput = z.infer<typeof inviteUsersInputSchema>;

const contactSchema = z.object({
  name: z.string(),
  email: z.email(),
});

export const bulkInviteInputSchema = z.object({
  contacts: z.array(contactSchema).min(1),
  subject: z.string(),
  message: z.string(),
  linkUrl: z.url(),
});
export type BulkInviteInput = z.infer<typeof bulkInviteInputSchema>;
