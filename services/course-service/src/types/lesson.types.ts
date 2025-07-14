import { lessons } from "../db/schema";

export type Lesson = typeof lessons.$inferSelect;
export type NewLesson = typeof lessons.$inferInsert;

export interface UpdateLessonDto {
  title: string;
}
