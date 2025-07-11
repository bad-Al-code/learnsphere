import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  jsonb,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const notifications = pgTable('notifications', {
  id: uuid('id')
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  recipientId: uuid('recipient_id').notNull(),
  type: text('type').notNull(),
  content: text('content').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  linkUrl: text('link_url'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
