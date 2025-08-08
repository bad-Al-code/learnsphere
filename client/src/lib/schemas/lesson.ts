import z from "zod";

export const createLessonSchema = z.object({
  title: z.string().min(1, "Title is required."),
});

export type CreateLessonFormValues = z.infer<typeof createLessonSchema>;

export const updateLessonSchema = z.object({
  title: z.string().min(1, "Title is required."),
});

export type UpdateLessonFormValues = z.infer<typeof updateLessonSchema>;
