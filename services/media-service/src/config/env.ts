import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(8002),

  AWS_REGION: z.string().min(1, 'AWS_REGION is required'),
  AWS_ACCESS_KEY_ID: z.string().min(1, 'AWS_ACCESS_KEY_ID is required'),
  AWS_SECRET_ACCESS_KEY: z.string().min(1, 'AWS_SECRET_ACCESS_KEY is required'),
  AWS_RAW_UPLOADS_BUCKET: z
    .string()
    .min(1, 'AWS_RAW_UPLOADS_BUCKET is required'),
  AWS_PROCESSED_MEDIA_BUCKET: z
    .string()
    .min(1, 'AWS_PROCESSED_MEDIA_BUCKET is required'),
  AWS_SQS_QUEUE_URL: z.string().min(1, 'AWS_SQS_QUEUE_URL is required'),
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
