import z from 'zod';

export const createLessonSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
});

export type CreateLessonFormValues = z.infer<typeof createLessonSchema>;

export const updateLessonSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
});

export type UpdateLessonFormValues = z.infer<typeof updateLessonSchema>;

export const lessonTypeEnum = ['video', 'text', 'quiz'] as const;
export type LessonType = (typeof lessonTypeEnum)[number];

export const lessonSchema = z.object({
  title: z.string().min(1, 'Lesson title is required.'),
  lessonType: z.enum(lessonTypeEnum).refine((val) => !!val, {
    message: 'Please select a lesson type.',
  }),
  content: z.string().optional(),
});

export type LessonFormValues = z.infer<typeof lessonSchema>;
