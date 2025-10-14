import { z } from 'zod';

export const bulkModulesSchema = z.object({
  body: z.object({
    moduleIds: z
      .array(z.string().uuid())
      .nonempty('At least one module ID is required'),
  }),
});
