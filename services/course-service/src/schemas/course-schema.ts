import { z } from "zod";
import { lessonTypeEnum } from "../db/schema";

export const createCourseSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: "Title is required" })
      .min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
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
  }),
});
