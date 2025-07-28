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

export const userRoleEnum = pgEnum('user_role', [
  'student',
  'instructor',
  'admin',
]);

export const users = pgTable('users', {
  id: uuid('id')
    .default(sql`gen_random_uuid()`)
    .primaryKey()
    .notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash'),
  role: userRoleEnum('role').default('student').notNull(),
  isVerified: boolean('is_verified').default(false).notNull(),
  verificationToken: text('verification_token'),
  secureVerificationToken: text('secure_verification_token'),
  verificationTokenExpiresAt: timestamp('verification_token_expires_at'),
  passwordResetToken: text('password_reset_token'),
  securePasswordResetToken: text('secure_password_reset_token'),
  passwordResetTokenExpiresAt: timestamp('password_reset_token_expires_at'),
  passwordChangedAt: timestamp('password_changed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const auditLogActionEnum = pgEnum('audit_log_action', [
  'LOGIN_SUCCESS',
  'LOGIN_FAILURE',
  'LOGOUT',
  'SIGNUP_SUCCESS',
  'PASSWORD_UPDATE_SUCCESS',
  'PASSWORD_RESET_REQUEST',
  'PASSWORD_RESET_SUCCESS',
  'EMAIL_VERIFICATION_SUCCESS',
  'EMAIL_VERIFICATION_RESEND',
]);

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id')
    .default(sql`gen_random_uuid()`)
    .primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  action: auditLogActionEnum('action').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  details: jsonb('details'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const userSessions = pgTable('user_sessions', {
  jti: uuid('jti').primaryKey(),
  userId: uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
