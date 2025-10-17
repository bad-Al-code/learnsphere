import { z } from 'zod';

export const courseSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  description: z.string().nullable().optional(),
  instructorId: z.uuid(),
  imageUrl: z.url().nullable().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced', 'all-levels']),
  rating: z.number().nullable().optional(),
  instructor: z
    .object({
      firstName: z.string().nullable().optional(),
      lastName: z.string().nullable().optional(),
    })
    .nullable()
    .optional(),
});

export const enrolledCourseSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  courseId: z.uuid(),
  // progressPercentage: z.string().transform((val) => parseFloat(val)),
  progressPercentage: z.coerce.number(),
  enrolledAt: z.iso.datetime(),
  lastAccessedAt: z.iso.datetime(),
  course: courseSchema,
  currentModule: z.string().default('Module X: Placeholder'),
});

export const paginationSchema = z.object({
  currentPage: z.number(),
  totalPages: z.number(),
  totalResults: z.number(),
});

export const getMyEnrolledCoursesResponseSchema = z.object({
  results: z.array(enrolledCourseSchema),
  pagination: paginationSchema,
});

export type EnrolledCourse = z.infer<typeof enrolledCourseSchema>;
export type GetMyEnrolledCoursesResponse = z.infer<
  typeof getMyEnrolledCoursesResponseSchema
>;
