import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(8004),

  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  RABBITMQ_URL: z.string().min(1, 'RABBITMQ_URL is required'),

  USER_SERVICE_URL: z.string().min(1, 'USER_SERVICE_URL is requied'),
  COURSE_SERVICE_URL: z.string().min(1, 'COURSE_SERVICE_URL is requied'),
  COMMUNITY_SERVICE_URL: z.string().min(1, 'COMMUNITY_SERVICE_URL is requied'),

  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET must be at least 32 characters long'),
  COOKIE_PARSER_SECRET: z
    .string()
    .min(32, 'COOKIE_PARSER_SECRET must be at least 32 characters long'),
  INTERNAL_API_KEY: z
    .string()
    .min(32, 'INTERNAL_API_KEY must be at least 32 characters long'),

  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
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
