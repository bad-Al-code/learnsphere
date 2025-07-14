import { courses, lessons, modules } from "../db/schema";

export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;
export type UpdateCourse = Partial<
  Omit<Course, "id" | "instructorId" | "createdAt" | "updatedAt">
>;

export type Module = typeof modules.$inferSelect;
export type NewModule = typeof modules.$inferInsert;

export type Lesson = typeof lessons.$inferSelect;
export type NewLesson = typeof lessons.$inferInsert;
