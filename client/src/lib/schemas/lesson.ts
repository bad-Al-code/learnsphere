import z from 'zod';

export const createLessonSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  lessonType: z.enum(['video', 'text', 'quiz']),
  content: z.string().optional(),
  isPublished: z.boolean().default(false).optional(),
});

export type CreateLessonFormValues = z.infer<typeof createLessonSchema>;

export const updateLessonSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  isPublished: z.boolean().optional(),
});

export type UpdateLessonFormValues = z.infer<typeof updateLessonSchema>;

export const lessonTypeEnum = ['video', 'text', 'quiz'] as const;
export type LessonType = (typeof lessonTypeEnum)[number];

export const lessonSchema = z.object({
  title: z.string().min(1, 'Lesson title is required.'),
  lessonType: z
    .enum(lessonTypeEnum)
    .refine((val) => !!val, {
      message: 'Please select a lesson type.',
    })
    .optional(),
  content: z.string().optional(),
});

export type LessonFormValues = z.infer<typeof lessonSchema>;
