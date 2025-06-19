import { z } from "zod";

export const createEnrollmentSchema = z.object({
  body: z.object({
    courseId: z
      .string({ required_error: "Course ID is requiredc" })
      .uuid("Invalid course ID format"),
  }),
});

export const markProgressSchema = z.object({
  body: z.object({
    courseId: z.string().uuid("Invalid course ID format"),
    lessonId: z.string().uuid("Invalid lesson ID format"),
  }),
});

export const manualEnrollmentSchema = z.object({
  body: z.object({
    userId: z.string().uuid("Invalid user ID format"),
    courseId: z.string().uuid("Invalid course ID format"),
  }),
});

export const enrollmentIdParamSchema = z.object({
  params: z.object({
    enrollmentId: z.string().uuid("Invalid enrollment ID format"),
  }),
});
