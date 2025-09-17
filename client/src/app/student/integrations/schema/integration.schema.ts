import { z } from 'zod';

export const publicIntegrationSchema = z.object({
  id: z.uuid(),
  provider: z.string(),
  status: z.string(),
  scopes: z.array(z.string()).nullable(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export const getIntegrationsResponseSchema = z.array(publicIntegrationSchema);

export type PublicIntegration = z.infer<typeof publicIntegrationSchema>;

export const connectGoogleResponseSchema = z.object({
  redirectUrl: z.url(),
});

export type ConnectGoogleResponse = z.infer<typeof connectGoogleResponseSchema>;
