import { lessons, lessonTypeEnum } from "../db/schema";

export type Lesson = typeof lessons.$inferSelect;
export type NewLesson = typeof lessons.$inferInsert;

export interface UpdateLessonDto {
  title?: string;
  content?: string;
}

export interface CreateLessonDto {
  title: string;
  moduleId: string;
  lessonType: (typeof lessonTypeEnum.enumValues)[number];
  content?: string;
}
