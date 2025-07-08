import { pgTable, text, timestamp, varchar, jsonb } from 'drizzle-orm/pg-core';

export type UserSettings = {
  theme: 'light' | 'dark';
  language: 'en' | 'es' | 'fr';
  notifications: {
    newCourseAlerts: boolean;
    weeklyNewsletter: boolean;
  };
};

export const profiles = pgTable('profiles', {
  userId: text('user_id').primaryKey(),
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
