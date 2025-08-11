import { courses, users } from '../db/schema';

export type NewCourse = typeof courses.$inferInsert;
export type UpdateCourse = Partial<Omit<NewCourse, 'id'>>;

export type NewUser = typeof users.$inferInsert;
