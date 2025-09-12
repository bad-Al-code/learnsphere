import { relations, sql } from 'drizzle-orm';
import {
  date,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export type UserSettings = {
  theme: 'light' | 'dark';
  language: 'en' | 'es' | 'fr' | string;
  notifications: {
    newCourseAlerts: boolean;
    weeklyNewsletter: boolean;
  };
};

export type InstructorApplicationData = {
  expertise: string;
  experience: string;
  motivation: string;
  submittedAt: string;
};

export const userStatusEnum = pgEnum('user_status', [
  'active',
  'instructor',
  'pending_instructor_review',
  'suspended',
]);

export type UserStatus = (typeof userStatusEnum.enumValues)[number];

export const profiles = pgTable('profiles', {
  userId: text('user_id').primaryKey(),
  email: text('email').notNull().unique(),
  firstName: varchar('first_name', { length: 50 }),
  lastName: varchar('last_name', { length: 50 }),
  bio: text('bio'),
  avatarUrls: jsonb('avatar_url').$type<{
    small?: string;
    medium?: string;
    large?: string;
  }>(),
  headline: varchar('headline', { length: 100 }),
  websiteUrl: text('website_url'),
  socialLinks: jsonb('social_links').$type<{
    twitter?: string;
    linkedin?: string;
    github?: string;
  }>(),

  instructorApplicationData: jsonb(
    'instructor_application_data'
  ).$type<InstructorApplicationData>(),

  fcmTokens: text('fcm_tokens')
    .array()
    .default(sql`ARRAY[]::text[]`)
    .notNull(),

  status: userStatusEnum('status').default('active').notNull(),
  dateOfBirth: date('date_of_birth'),
  lastKnownDevice: text('last_known_device'),
  settings: jsonb('settings')
    .$type<UserSettings>()
    .default({
      theme: 'light',
      language: 'en',
      notifications: {
        newCourseAlerts: true,
        weeklyNewsletter: false,
      },
    })
    .notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const aiTutorMessageRoleEnum = pgEnum('ai_tutor_message_role', [
  'user',
  'model',
]);

export const aiTutorConversations = pgTable('ai_tutor_conversations', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => profiles.userId, { onDelete: 'cascade' }),
  courseId: uuid('course_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const aiTutorMessages = pgTable('ai_tutor_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  conversationId: uuid('conversation_id')
    .notNull()
    .references(() => aiTutorConversations.id, { onDelete: 'cascade' }),
  role: aiTutorMessageRoleEnum('role').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const profilesRelations = relations(profiles, ({ many }) => ({
  aiTutorConversations: many(aiTutorConversations),
}));

export const aiTutorConversationsRelations = relations(
  aiTutorConversations,
  ({ one, many }) => ({
    user: one(profiles, {
      fields: [aiTutorConversations.userId],
      references: [profiles.userId],
    }),
    messages: many(aiTutorMessages),
  })
);

export const aiTutorMessagesRelations = relations(
  aiTutorMessages,
  ({ one }) => ({
    conversation: one(aiTutorConversations, {
      fields: [aiTutorMessages.conversationId],
      references: [aiTutorConversations.id],
    }),
  })
);
