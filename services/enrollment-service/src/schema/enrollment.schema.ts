import { z } from "zod";

export const createEnrollmentSchema = z.object({
  body: z.object({
    courseId: z
      .string({ required_error: "Course ID is requiredc" })
      .uuid("Invalid course ID format"),
  }),
});
