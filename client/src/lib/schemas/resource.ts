import { z } from 'zod';

export const createResourceSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  fileUrl: z.url(),
  fileName: z.string().min(1),
  fileSize: z.number().int().positive(),
  fileType: z.string().min(1),
});

export const updateResourceSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
});

export type CreateResourceDto = z.infer<typeof createResourceSchema>;
export type UpdateResourceDto = z.infer<typeof updateResourceSchema>;
