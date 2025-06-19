import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).max(50).optional(),
    lastName: z.string().min(1).max(50).optional(),
    bio: z.string().max(500).optional(),
    headline: z.string().max(100).optional().nullable(),
    websiteUrl: z
      .string()
      .url({ message: "Invalid URL format" })
      .optional()
      .nullable(),
    socialLinks: z
      .object({
        twitter: z.string().optional(),
        linkedin: z.string().optional(),
        github: z.string().optional(),
      })
      .optional()
      .nullable(),
  }),
});

export const avatarUploadUrlSchema = z.object({
  body: z.object({
    filename: z.string(),
  }),
});

export const searchProfileSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
  }),
});

export const bulkUsersSchema = z.object({
  body: z.object({
    userIds: z.array(z.string().uuid()).nonempty(),
  }),
});
