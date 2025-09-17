import { z } from 'zod';

export const publicIntegrationSchema = z.object({
  id: z.string().uuid(),
  provider: z.string(),
  status: z.string(),
  scopes: z.array(z.string()).nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type PublicIntegration = z.infer<typeof publicIntegrationSchema>;

export const integrationIdParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('A valid integration ID is required.'),
  }),
});
