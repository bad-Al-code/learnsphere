import { z } from "zod";
import { lessonTypeEnum } from "../db/schema";

export const createCourseSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: "Title is required" })
      .min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    prerequisiteCourseId: z.string().uuid().optional().nullable(),
  }),
});

export const createModuleSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Title is required" }).min(3),
  }),
});

export const createLessonSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "Title is required" }).min(3),
    lessonType: z.enum(lessonTypeEnum.enumValues),
    content: z.string().optional(),
  }),
});

export const listCoursesSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(12),
  }),
});

export const reorderSchema = z.object({
  body: z.object({
    ids: z.array(z.string().uuid()),
  }),
});

export const bulkCoursesSchema = z.object({
  body: z.object({
    courseIds: z
      .array(z.string().uuid())
      .nonempty("At least one course ID is required"),
  }),
});
