import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import { text, timestamp, uuid, pgTable, boolean } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  // TODO: remove unique frm passwordHash
  passwordHash: text("password_hash").notNull().unique(),
  isVerified: boolean("is_verified").default(false).notNull(),
  verificationToken: text("verification_token"),
  verificationTokenExpiresAt: timestamp("verification_token_expires_at"),
  passwordResetToken: text("password_reset_token"),
  passwordResetTokenExpiresAt: timestamp("password_reset_token_expires_at"),
  passwordChangedAt: timestamp("password_changed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
