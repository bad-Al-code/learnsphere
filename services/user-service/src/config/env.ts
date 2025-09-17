import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(8001),

  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  RABBITMQ_URL: z.string().min(1, 'RABBITMQ_URL is required'),
  MEDIA_SERVICE_URL: z.string().url().default('http://localhost:8002'),

  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  COOKIE_PARSER_SECRET: z.string().min(1, 'COOKIE_PARSER_SECRET is required'),
  ENCRYPTION_KEY: z
    .string()
    .length(64, 'ENCRYPTION_KEY must be a 64-character hex string (32 bytes).'),

  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    'Invalid environment variables in user-service:',
    parsedEnv.error.flatten().fieldErrors
  );
  process.exit(1);
}

export const env = parsedEnv.data;
