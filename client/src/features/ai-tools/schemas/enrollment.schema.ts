import { z } from 'zod';

export const enrolledCourseSchema = z.object({
  enrollmentId: z.uuid(),
  enrolledAt: z.iso.datetime(),
  progressPercentage: z.number(),
  course: z.object({
    id: z.uuid(),
    title: z.string(),
    imageUrl: z.url().nullable().optional(),
  }),
});

export const enrolledCoursesResponseSchema = z.array(enrolledCourseSchema);
export type EnrolledCourse = z.infer<typeof enrolledCourseSchema>;
