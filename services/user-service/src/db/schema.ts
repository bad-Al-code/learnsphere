import { pgTable, text, timestamp, varchar, jsonb } from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  userId: text("user_id").primaryKey(),
  firstName: varchar("first_name", { length: 50 }),
  lastName: varchar("last_name", { length: 50 }),
  bio: text("bio"),
  avatarUrls: jsonb("avatar_url").$type<{
    small?: string;
    medium?: string;
    large?: string;
  }>(),
  headline: varchar("headline", { length: 100 }),
  websiteUrl: text("website_url"),
  socialLinks: jsonb("social_links").$type<{
    twitter?: string;
    linkedin?: string;
    github?: string;
  }>(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
