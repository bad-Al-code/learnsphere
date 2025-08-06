import { z } from "zod";

export const COURSE_LEVELS = [
  "beginner",
  "intermediate",
  "advanced",
  "all-levels",
] as const;

export const createCourseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  categoryId: z.string().uuid("Please select a category."),
  level: z.enum(COURSE_LEVELS),
});

export const priceSchema = z.object({
  price: z.coerce
    .number()
    .min(0, "Price must be a positive number.")
    .optional()
    .nullable(),
});

export type PriceFormValues = z.input<typeof priceSchema>;
