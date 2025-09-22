import z from 'zod';

export const requestRecheckParamsSchema = z.object({
  submissionId: z.string().uuid(),
});
