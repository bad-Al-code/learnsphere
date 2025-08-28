import z from 'zod';

export const moduleSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
});

export const moduleUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  isPublished: z.boolean().optional(),
});

export type ModuleUpdateSchemaValues = z.infer<typeof moduleUpdateSchema>;
export type ModuleSchemaValues = z.infer<typeof moduleSchema>;
