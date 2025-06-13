import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    bio: z.string().max(500).optional(),
  }),
});

export const avatarUploadUrlSchema = z.object({
  body: z.object({
    filename: z.string(),
  }),
});
