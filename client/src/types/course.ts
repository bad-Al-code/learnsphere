import { Module } from './module';

export type Course = {
  id: string;
  title: string;
  description: string | null;
  status: 'draft' | 'published';
  level: string;
  imageUrl: string | null;
  price: number | null;
  currency?: string | null;
  instructorId: string;
  averageRating?: number | null;
  enrollmentCount?: number | null;
  updatedAt?: string | null;
  modules: Module[];
};

export const COURSE_LEVELS = [
  { value: 'all', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export type CourseFilterOptions = {
  query?: string;
  categoryId?: string;
  level?: string;
  price?: 'free' | 'paid';
  status?: string;
  duration?: string;
  sortBy?: 'newest' | 'rating' | 'popularity';
  page?: number;
  limit?: number;
};

export type PrerequisiteCourse = { id: string; title: string };

export interface BulkCourse {
  id: string;
  title: string;
}
