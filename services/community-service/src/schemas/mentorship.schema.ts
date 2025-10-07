import { z } from 'zod';
import { mentorshipStatusEnum } from '../db/schema';

export const statusEnum = z.enum([...mentorshipStatusEnum.enumValues, 'all']);

/**
 * @openapi
 * components:
 *   schemas:
 *     GetMentorshipProgramsQuery:
 *       type: object
 *       properties:
 *         query:
 *           type: string
 *           description: Optional search keyword to filter mentorship programs by title.
 *           example: "JavaScript"
 *         status:
 *           type: string
 *           enum: [open, filling-fast, full, all]
 *           description: Filter programs by status (or use "all" for no filtering).
 *           example: open
 *         isFree:
 *           type: boolean
 *           description: Filter only free mentorship programs if true.
 *           example: true
 *         isFavorite:
 *           type: boolean
 *           description: Filter only favorite programs if true.
 *           example: false
 *         userId:
 *           type: string
 *           format: uuid
 *           description: Filter programs by a specific user's mentorship programs.
 *           example: "5cd028a2-7e04-47fb-9002-ebb9af4ab534"
 *         limit:
 *           type: integer
 *           minimum: 1
 *           description: Number of programs to return (defaults to 9).
 *           example: 10
 *         cursor:
 *           type: string
 *           description: Program ID used for pagination (fetch programs created before this one).
 *           example: "5cd028a2-7e04-47fb-9002-ebb9af4ab534"
 */
export const getMentorshipProgramsSchema = z.object({
  query: z.object({
    query: z
      .string()
      .optional()
      .transform((val) => val?.trim()),

    status: statusEnum.optional(),

    isFree: z.preprocess((val) => val === 'true', z.boolean()).optional(),

    isFavorite: z.preprocess((val) => val === 'true', z.boolean()).optional(),

    userId: z.uuid().optional(),

    limit: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : 9))
      .refine((val) => !isNaN(val) && val > 0, {
        message: 'Limit must be a positive number',
      }),

    cursor: z.string().optional(),
  }),
});

export type GetMentorshipProgramsQuery = z.infer<
  typeof getMentorshipProgramsSchema
>['query'];

export const becomeMentorSchema = z.object({
  body: z.object({
    expertise: z
      .string()
      .min(10, 'Please describe your expertise in more detail.'),
    experience: z.string().min(1, 'Please select your years of experience.'),
    availability: z.string().min(1, 'Please select your weekly availability.'),
  }),
});

export type BecomeMentorDto = z.infer<typeof becomeMentorSchema.shape.body>;
