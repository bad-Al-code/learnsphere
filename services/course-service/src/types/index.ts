export * from "./course.types";
export * from "./module.types";

import { lessons, modules } from "../db/schema";

export type Lesson = typeof lessons.$inferSelect;
export type NewLesson = typeof lessons.$inferInsert;
