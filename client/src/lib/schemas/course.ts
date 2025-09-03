import { z } from 'zod';

export const COURSE_LEVELS = [
  'beginner',
  'intermediate',
  'advanced',
  'all-levels',
] as const;

export const courseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().optional().nullable(),
  categoryId: z.uuid('Please select a category.').optional().nullable(),
  level: z.enum(COURSE_LEVELS).optional(),
  status: z.enum(['draft', 'published']),
  price: z.number().positive().optional().nullable(),
  currency: z.string().length(3).default('INR').optional().nullable(),
  imageUrl: z.url('A valid image URL is required.').optional().nullable(),
  prerequisiteCourseId: z
    .uuid('Invalid prerequisite course ID.')
    .optional()
    .nullable(),
  duration: z
    .number()
    .int()
    .min(0, 'Duration must be a positive number.')
    .optional()
    .nullable(),
  modules: z
    .array(
      z.object({
        title: z.string().min(1, 'Module title cannot be empty.'),
      })
    )
    .min(1, 'Please add at least one module.'),
});

export type CourseFormValues = z.infer<typeof courseSchema>;

export const priceSchema = z.object({
  price: z.coerce
    .number()
    .min(0, 'Price must be a positive number.')
    .optional()
    .nullable(),
});

export type PriceFormValues = z.input<typeof priceSchema>;

export const searchQuerySchema = z
  .string()
  .min(1, 'Search query cannot be empty.');

export const updateCourseSchema = z.object({
  title: z.string().min(1, 'Title is required.').optional(),
  description: z
    .string()
    .min(1, 'Description is required.')
    .nullable()
    .optional(),
  categoryId: z
    .string()
    .min(1, 'Please select a category.')
    .nullable()
    .optional(),
  level: z
    .enum(['beginner', 'intermediate', 'advanced', 'all-levels'])
    .optional(),
  price: z.union([z.coerce.number().min(0), z.null()]).optional(),
});

export type UpdateCourseValues = z.infer<typeof updateCourseSchema>;

export const resourceSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  courseId: z.string().uuid(),
  fileUrl: z.string().url(),
  fileName: z.string(),
  fileSize: z.number(),
  fileType: z.string(),
  order: z.number(),
  status: z.enum(['draft', 'published']),
  createdAt: z.iso.datetime(),
});

export type Resource = z.infer<typeof resourceSchema>;

export const createResourceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  fileUrl: z.url(),
  fileName: z.string(),
  fileSize: z.number().int().positive(),
  fileType: z.string(),
  status: z.enum(['draft', 'published']).default('draft'),
});
export type CreateResourceValues = z.infer<typeof createResourceSchema>;

export const updateResourceSchema = createResourceSchema.partial();
export type UpdateResourceValues = z.infer<typeof updateResourceSchema>;
