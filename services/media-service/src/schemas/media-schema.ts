import { z } from "zod";

export const getUploadUrlSchema = z.object({
  body: z.object({
    filename: z.string({ required_error: "Filename is required" }),
    userId: z.string({ required_error: "User ID is required" }),
    context: z.record(z.string()).optional(),
  }),
});
