import { courses } from '../db/schema';

export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;
export type UpdateCourse = Partial<
  Omit<Course, 'id' | 'instructorId' | 'createdAt' | 'updatedAt'>
>;

export interface CreateCourseDto {
  title: string;
  description?: string | null;
  instructorId: string;
}

export interface UpdateCourseDto {
  title?: string;
  description?: string | null;
  prerequisiteCourseId?: string | null;
}

export type CourseWithInstructor = Course & {
  instructor?: {
    userId: string;
    firstName?: string | null;
    lastName?: string | null;
  } | null;
};

export interface Requester {
  id: string;
  role: 'student' | 'instructor' | 'admin';
}
