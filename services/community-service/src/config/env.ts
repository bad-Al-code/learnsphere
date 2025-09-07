import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(8007),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  REDIS_URL: z.string().min(1, 'REDIS_URL is required'),
  RABBITMQ_URL: z.string().min(1, 'RABBITMQ_URL is required'),
  USER_SERVICE_URL: z.string().min(1, 'USER_SERVICE_URL is required'),
  MEDIA_SERVICE_URL: z.string().min(1, 'MEDIA_SERVICE_URL is required'),

  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  COOKIE_PARSER_SECRET: z.string().min(1, 'COOKIE_PARSER_SECRET is required'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    'Invalid environment variables in community-service:',
    parsedEnv.error.flatten().fieldErrors
  );
  process.exit(1);
}

export const env = parsedEnv.data;
