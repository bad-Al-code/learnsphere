import { sql } from 'drizzle-orm';
import {
  pgTable,
  pgEnum,
  uuid,
  text,
  jsonb,
  timestamp,
} from 'drizzle-orm/pg-core';

export const mediaStatusEnum = pgEnum('media_status', [
  'uploading',
  'processing',
  'completed',
  'failed',
]);

export const uploadTypeEnum = pgEnum('upload_type', ['avatar', 'video']);

export const mediaAssets = pgTable('media_assets', {
  id: uuid('id')
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  s3Key: text('s3_key').notNull().unique(),
  ownerUserId: uuid('owner_user_id'),
  parentEntityId: uuid('parent_entity_id'),
  uploadType: uploadTypeEnum('upload_type').notNull(),
  status: mediaStatusEnum('status').default('uploading').notNull(),
  errorMessage: text('error_message'),
  processedUrls: jsonb('processed_urls'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
