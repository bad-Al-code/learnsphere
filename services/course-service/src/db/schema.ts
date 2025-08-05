import { relations } from 'drizzle-orm';
import {
  decimal,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
});

export const courseStatusEnum = pgEnum('course_status', ['draft', 'published']);
export const courseLevelEnum = pgEnum('course_level', [
  'beginner',
  'intermediate',
  'advanced',
  'all-levels',
]);

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
});

export const textLessonContent = pgTable('text_lesson_content', {
  id: uuid('id').primaryKey().defaultRandom(),
  lessonId: uuid('lesson_id')
    .references(() => lessons.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  content: text('content').notNull(),
});

export const categoryRelations = relations(categories, ({ many }) => ({
  courses: many(courses),
}));

export const courseRelations = relations(courses, ({ many, one }) => ({
  modules: many(modules),
  category: one(categories, {
    fields: [courses.categoryId],
    references: [categories.id],
  }),
}));

export const moduleRelations = relations(modules, ({ one, many }) => ({
  course: one(courses, {
    fields: [modules.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
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
