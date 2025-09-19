import { z } from 'zod';

const instructorSchema = z.object({
  userId: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
});

const enrolledCourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  imageUrl: z.string().url().nullable(),
  instructor: instructorSchema.nullable(),
});

export const myCourseSchema = z.object({
  enrollmentId: z.string(),
  enrolledAt: z.iso.datetime(),
  progressPercentage: z.number(),
  lastAccessedAt: z.iso.datetime(),
  course: enrolledCourseSchema,
});

export const myCoursesResponseSchema = z.array(myCourseSchema);
export type MyCourse = z.infer<typeof myCourseSchema>;
