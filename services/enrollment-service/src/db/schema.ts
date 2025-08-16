import {
  decimal,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

type ModuleSnapshot = {
  id: string;
  lessonIds: string[];
};

type CourseStructure = {
  totalLessons: number;
  modules: ModuleSnapshot[];
};

type EnrollmentProgress = {
  completedLessons: string[];
};

export const enrollmentStatusEnum = pgEnum('enrollment_status', [
  'active',
  'suspended',
  'completed',
]);

export type EnrolllmentStatus =
  (typeof enrollmentStatusEnum.enumValues)[number];

export const enrollments = pgTable(
  'enrollments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    status: enrollmentStatusEnum('status').notNull().default('active'),
    userId: uuid('user_id').notNull(),
    courseId: uuid('course_id').notNull(),
    coursePriceAtEnrollment: decimal('course_price_at_enrollment', {
      precision: 10,
      scale: 2,
    })
      .notNull()
      .default('0.00'),
    courseStructure: jsonb('course_structure')
      .$type<CourseStructure>()
      .notNull()
      .default({ totalLessons: 0, modules: [] }),
    progress: jsonb('progress')
      .$type<EnrollmentProgress>()
      .notNull()
      .default({ completedLessons: [] }),
    progressPercentage: decimal('progress_percentage', {
      precision: 5,
      scale: 2,
    })
      .notNull()
      .default('0.00'),
    enrolledAt: timestamp('enrolled_at').defaultNow().notNull(),
    lastAccessedAt: timestamp('last_accessed_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return [unique('user_course_unique_idx').on(table.userId, table.courseId)];
  }
);

export const courseStatusEnum = pgEnum('course_status', ['draft', 'published']);

export const courses = pgTable('courses', {
  id: uuid('id').primaryKey(),
  instructorId: uuid('instructor_id').notNull(),
  status: courseStatusEnum('status').default('draft').notNull(),
  prerequisiteCourseId: uuid('prerequisite_course_id'),
  price: decimal('price', { precision: 10, scale: 2 }).default('0.00'),
  currency: varchar('currency', { length: 3 }).default('INR'),
});

export const userRoleEnum = pgEnum('user_role', [
  'student',
  'instructor',
  'admin',
]);

export type UserRole = (typeof userRoleEnum.enumValues)[number];

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  role: userRoleEnum('role').default('student').notNull(),
});

export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;
export type UpdatedCourse = Partial<Omit<NewCourse, 'id'>>;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
