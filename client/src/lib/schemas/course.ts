import { z } from "zod";

export const COURSE_LEVELS = [
  "beginner",
  "intermediate",
  "advanced",
  "all-levels",
] as const;

export const createCourseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  description: z.string().optional().nullable(),
  categoryId: z.uuid("Please select a category.").optional().nullable(),
  level: z.enum(COURSE_LEVELS).optional(),
  status: z.enum(["draft", "published"]),
  price: z.number().positive().optional().nullable(),
  currency: z.string().length(3).optional().nullable(),
  modules: z
    .array(
      z.object({
        title: z.string().min(1, "Module title cannot be empty."),
      })
    )
    .min(1, "Please add at least one module."),
});

export type CreateCourseValues = z.infer<typeof createCourseSchema>;

export const priceSchema = z.object({
  price: z.coerce
    .number()
    .min(0, "Price must be a positive number.")
    .optional()
    .nullable(),
});

export type PriceFormValues = z.input<typeof priceSchema>;

export const searchQuerySchema = z
  .string()
  .min(1, "Search query cannot be empty.");
