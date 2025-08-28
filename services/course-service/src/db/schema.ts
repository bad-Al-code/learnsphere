import { relations } from 'drizzle-orm';
import {
  boolean,
  decimal,
  integer,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const courseStatusEnum = pgEnum('course_status', ['draft', 'published']);

export const courseLevelEnum = pgEnum('course_level', [
  'beginner',
  'intermediate',
  'advanced',
  'all-levels',
]);

export type CourseLevel = (typeof courseLevelEnum.enumValues)[number];

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
});

export const courses = pgTable('courses', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  instructorId: uuid('instructor_id').notNull(),
  status: courseStatusEnum('status').default('draft').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }),
  currency: varchar('currency', { length: 3 }).default('INR'),
  imageUrl: text('image_url'),
  level: courseLevelEnum('level').default('all-levels').notNull(),
  prerequisiteCourseId: uuid('prerequisite_course_id').references(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (): any => courses.id
  ),
  categoryId: uuid('category_id').references(() => categories.id, {
    onDelete: 'set null',
  }),
  duration: integer('duration').default(0),
  averageRating: real('rating_count').default(0),
  enrollmentCount: integer('enrollment_count').default(0),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const modules = pgTable('modules', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  courseId: uuid('course_id')
    .references(() => courses.id, { onDelete: 'cascade' })
    .notNull(),
  order: integer('order').default(0).notNull(),
  isPublished: boolean('is_published').default(false).notNull(),
});

export const lessonTypeEnum = pgEnum('lesson_type', ['video', 'text', 'quiz']);

export const lessons = pgTable('lessons', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  moduleId: uuid('module_id')
    .references(() => modules.id, { onDelete: 'cascade' })
    .notNull(),
  order: integer('order').default(0).notNull(),
  lessonType: lessonTypeEnum('lesson_type').notNull(),
  contentId: text('content_id'),
  isPublished: boolean('is_published').default(false).notNull(),
});

export const textLessonContent = pgTable('text_lesson_content', {
  id: uuid('id').primaryKey().defaultRandom(),
  lessonId: uuid('lesson_id')
    .references(() => lessons.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  content: text('content').notNull(),
});

export const assignmentStatusEnum = pgEnum('assignment_status', [
  'draft',
  'published',
]);
export type AssignmentStatus = (typeof assignmentStatusEnum.enumValues)[number];

export const assignments = pgTable('assignments', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),

  courseId: uuid('course_id')
    .references(() => courses.id, { onDelete: 'cascade' })
    .notNull(),

  moduleId: uuid('module_id')
    .references(() => modules.id, { onDelete: 'cascade' })
    .notNull(),

  dueDate: timestamp('due_date'),

  status: assignmentStatusEnum('status').default('draft').notNull(),

  order: integer('order').default(0).notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const resources = pgTable('resources', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),

  courseId: uuid('course_id')
    .references(() => courses.id, { onDelete: 'cascade' })
    .notNull(),

  fileUrl: text('file_url').notNull(),
  fileName: varchar('file_name', { length: 255 }).notNull(),
  fileSize: integer('file_size').notNull(), // in bytes
  fileType: varchar('file_type', { length: 100 }).notNull(),

  order: integer('order').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const assignmentSubmissions = pgTable('assignment_submissions', {
  id: uuid('id').defaultRandom().primaryKey(),
  assignmentId: uuid('assignment_id')
    .references(() => assignments.id, { onDelete: 'cascade' })
    .notNull(),
  studentId: uuid('student_id').notNull(),
  courseId: uuid('course_id').notNull(),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
  grade: integer('grade'),
});

export const resourceDownloads = pgTable('resource_downloads', {
  id: uuid('id').defaultRandom().primaryKey(),
  resourceId: uuid('resource_id')
    .references(() => resources.id, { onDelete: 'cascade' })
    .notNull(),
  studentId: uuid('student_id').notNull(),
  courseId: uuid('course_id').notNull(),
  downloadedAt: timestamp('downloaded_at').defaultNow().notNull(),
});

export const resourcesRelations = relations(resources, ({ one, many }) => ({
  course: one(courses, {
    fields: [resources.courseId],
    references: [courses.id],
  }),
  downloads: many(resourceDownloads),
}));

export const categoryRelations = relations(categories, ({ many }) => ({
  courses: many(courses),
}));

export const courseRelations = relations(courses, ({ many, one }) => ({
  modules: many(modules),
  category: one(categories, {
    fields: [courses.categoryId],
    references: [categories.id],
  }),
  resources: many(resources),
}));

export const moduleRelations = relations(modules, ({ one, many }) => ({
  course: one(courses, {
    fields: [modules.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
  assignments: many(assignments),
}));

export const lessonRelations = relations(lessons, ({ one }) => ({
  module: one(modules, {
    fields: [lessons.moduleId],
    references: [modules.id],
  }),
  textContent: one(textLessonContent, {
    fields: [lessons.id],
    references: [textLessonContent.lessonId],
  }),
}));

export const textLessonContentRelations = relations(
  textLessonContent,
  ({ one }) => ({
    lesson: one(lessons, {
      fields: [textLessonContent.lessonId],
      references: [lessons.id],
    }),
  })
);

export const assignmentRelations = relations(assignments, ({ one, many }) => ({
  module: one(modules, {
    fields: [assignments.moduleId],
    references: [modules.id],
  }),
  submissions: many(assignmentSubmissions),
}));

export const assignmentSubmissionsRelations = relations(
  assignmentSubmissions,
  ({ one }) => ({
    assignment: one(assignments, {
      fields: [assignmentSubmissions.assignmentId],
      references: [assignments.id],
    }),
  })
);

export const resourceDownloadsRelations = relations(
  resourceDownloads,
  ({ one }) => ({
    resource: one(resources, {
      fields: [resourceDownloads.resourceId],
      references: [resources.id],
    }),
  })
);
