import { z } from "zod";

export const requestUploadUrlSchema = z.object({
  body: z.object({
    filename: z.string({ required_error: "Filename is required" }),
    uploadType: z.enum(["avatar", "video"]),
    metadata: z.record(z.string()),
  }),
});
