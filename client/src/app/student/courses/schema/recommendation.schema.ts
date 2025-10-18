import { z } from 'zod';

export const courseDifficultyEnum = z.enum([
  'Beginner',
  'Intermediate',
  'Advanced',
]);
export type CourseDifficulty = z.infer<typeof courseDifficultyEnum>;

export const recommendedCourseSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  instructorId: z.uuid(),
  imageUrl: z.url().nullable(),
  rating: z.number().nullable(),
  difficulty: courseDifficultyEnum,
  duration: z.number().nullable(),
  price: z.string().nullable(),
  reason: z.string(),
});

export type RecommendedCourse = z.infer<typeof recommendedCourseSchema>;
