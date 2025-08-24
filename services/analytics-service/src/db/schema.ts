import {
  date,
  decimal,
  integer,
  pgTable,
  primaryKey,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const instructorDailyStats = pgTable(
  'instructor_daily_stats',
  {
    instructorId: uuid('instructor_id').notNull(),
    date: date('date').notNull(),
    totalRevenue: decimal('total_revenue', { precision: 10, scale: 2 })
      .notNull()
      .default('0'),
    enrollments: integer('enrollments').notNull().default(0),
  },
  (table) => [primaryKey({ columns: [table.instructorId, table.date] })]
);

export const courseStats = pgTable('course_stats', {
  courseId: uuid('course_id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  instructorId: uuid('instructor_id').notNull(),
  totalEnrollments: integer('total_enrollments').notNull().default(0),
  totalRevenue: decimal('total_revenue', { precision: 10, scale: 2 })
    .notNull()
    .default('0'),
  averageCompletionRate: integer('average_completion_rate')
    .notNull()
    .default(0),
});

export const courses = pgTable('courses', {
  id: uuid('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  instructorId: uuid('instructor_id').notNull(),
});

export type NewCourse = typeof courses.$inferInsert;
