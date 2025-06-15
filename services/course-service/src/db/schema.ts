import {
  pgTable,
  uuid,
  text,
  varchar,
  timestamp,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const courseStatusEnum = pgEnum("course_status", ["draft", "published"]);

export const courses = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  instructorId: uuid("instructor_id").notNull(),
  status: courseStatusEnum("status").default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const modules = pgTable("modules", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  courseId: uuid("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").default(0).notNull(),
});

export const lessonTypeEnum = pgEnum("lesson_type", ["video", "text", "quiz"]);

export const lessons = pgTable("lessons", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  moduleId: uuid("module_id")
    .references(() => modules.id, { onDelete: "cascade" })
    .notNull(),
  order: integer("order").default(0).notNull(),
  lessonType: lessonTypeEnum("lesson_type").notNull(),
  contentId: text("content_id"),
});

export const textLessonContent = pgTable("text_lesson_content", {
  id: uuid("id").primaryKey().defaultRandom(),
  lessonId: uuid("lesson_id")
    .references(() => lessons.id, { onDelete: "cascade" })
    .notNull()
    .unique(),
  content: text("content").notNull(),
});

export const courseRelations = relations(courses, ({ many }) => ({
  modules: many(modules),
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
