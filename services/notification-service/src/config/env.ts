import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(8006),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  RABBITMQ_URL: z.string().min(1, 'RABBITMQ_URL is required'),
  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL must be a valid postgresql URL'),
  USER_SERVICE_URL: z.string().min(1, 'USER_SERVCE_URL is required'),

  GOOGLE_APPLICATION_CREDENTIALS: z
    .string()
    .min(1, 'Path to Firebase service account key is required'),
  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),
  EMAIL_FROM_ADDRESS: z
    .string()
    .min(1, 'EMAIL_FROM_ADDRESS must be a valid email'),
  EMAIL_FROM_NAME: z.string().min(1, 'EMAIL_FROM_NAME is required'),

  COOKIE_PARSER_SECRET: z.string().min(1, 'COOKIE_PARSER_SECRET is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    'Invalid environment variables:',
    parsedEnv.error.flatten().fieldErrors
  );
  process.exit(1);
}

export const env = parsedEnv.data;
