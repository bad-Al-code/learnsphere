import { uuid, timestamp, unique, pgTable, jsonb } from "drizzle-orm/pg-core";

export const enrollments = pgTable(
  "enrollments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    courseId: uuid("course_id").notNull(),
    enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),

    progress: jsonb("progress").default({}).notNull(),
  },
  (table) => {
    return [unique("unique_enrollment").on(table.userId, table.courseId)];
  }
);
