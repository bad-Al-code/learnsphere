export type Course = {
  status: 'draft' | 'published';
  id: string;
  title: string;
  description: string | null;
  level: string;
  imageUrl: string | null;
  price: number | null;
  currency: string | undefined;
  instructor?: {
    firstName: string | null;
    lastName: string | null;
    avatarUrls?: { small?: string };
  } | null;
  averageRating?: number | null;
  completionRate?: number | null;
  updatedAt?: string | null;
  enrollmentCount?: number | null;
  modules?: number[] | [];
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
  duration?: string;
  sortBy?: 'newest' | 'rating' | 'popularity';
  page?: number;
  limit?: number;
};

export type PrerequisiteCourse = { id: string; title: string };
