import { sql } from "drizzle-orm";
import { text, timestamp, uuid, pgTable, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull().unique(),
  isVerified: boolean("is_verified").default(false).notNull(),
  verificationToken: text("verification_tokne"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
