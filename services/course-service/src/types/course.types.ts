import { courses } from '../db/schema';
import { CourseLevelEnum } from '../schemas';

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

export type CourseLevel = CourseLevelEnum;

export interface FindCoursesByInstructorOptions {
  instructorId: string;
  query?: string;
  categoryId?: string;
  level?: CourseLevel;
  price?: 'free' | 'paid';
  duration?: 'short' | 'medium' | 'long';
  sortBy?: 'newest';
  page: number;
  limit: number;
}
