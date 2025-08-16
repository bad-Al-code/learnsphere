import { sql } from 'drizzle-orm';
import {
  boolean,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

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

export const emailStatusEnum = pgEnum('email_status', ['sent', 'failed']);

export const emailOutbox = pgTable('email_outbox', {
  id: uuid('id')
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  recipient: text('recipient').notNull(),
  subject: text('subject').notNull(),
  type: text('type').notNull(),
  status: emailStatusEnum('satus').notNull(),
  errorMessage: text('error_message'),
  sentAt: timestamp('sent_at').defaultNow().notNull(),
});

export const userRoleEnum = pgEnum('user_role', [
  'student',
  'instructor',
  'admin',
]);

export type UserRole = (typeof userRoleEnum.enumValues)[number];

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  role: userRoleEnum('role').default('student').notNull(),
  email: text('email').notNull().unique(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
