import { z } from 'zod';

export const videoUploadUrlSchema = z.object({
  body: z.object({
    filename: z.string(),
  }),
});
