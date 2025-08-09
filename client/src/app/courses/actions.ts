'use server';

import { courseService, enrollmentService } from '@/lib/api';
import { searchQuerySchema } from '@/lib/schemas/course';
import { redirect } from 'next/navigation';
import z from 'zod';
import { getCurrentUser } from '../(auth)/actions';

export async function getPublicCourses({
  page = 1,
  limit = 12,
  categoryId,
  level,
}: {
  page?: number;
  limit?: number;
  categoryId?: string;
  level?: string;
}) {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (categoryId) {
      params.set('categoryId', categoryId);
    }
    if (level) {
      params.set('level', level);
    }

    const response = await courseService.get(
      `/api/courses?${params.toString()}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch courses.');
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error(`Error fetching public courses: `, error);

    return {
      results: [],
      pagination: { currentPage: 1, totalPages: 0, totalResults: 0, limit: 12 },
    };
  }
}

export async function getCoursesByIds(courseIds: string[]) {
  try {
    const response = await courseService.post('/api/courses/bulk', {
      courseIds,
    });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    return [];
  }
}

export async function getCourseDetails(courseId: string) {
  try {
    const response = await courseService.get(`/api/courses/${courseId}`);
    if (!response.ok) {
      throw new Error('Course not found.');
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error(`Error fetching course details for ${courseId}`);

    return null;
  }
}

export async function enrollInCourse(courseId: string) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: 'You must log in to enroll.' };
  }

  try {
    const response = await enrollmentService.post(`/api/enrollments`, {
      courseId: courseId,
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));

      throw new Error(
        data.errors?.[0]?.message || 'Failed to enroll in the course.'
      );
    }
  } catch (error: any) {
    return { error: error.message };
  }

  redirect(`/learn/${courseId}`);
}

export async function getCategoryOptions() {
  try {
    const response = await courseService.get(`/api/categories/list`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories.');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching category options:', error);
    return [];
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    const response = await courseService.get(`/api/categories/slug/${slug}`);

    if (!response.ok) return null;

    return await response.json();
  } catch (error) {
    return null;
  }
}

export async function serachCourseForCommand(query: string) {
  try {
    const validatedQuery = searchQuerySchema.parse(query);
    const params = new URLSearchParams({ q: validatedQuery });

    const response = await courseService.get(
      `/api/courses/public-search?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch search results.');
    }

    const courses = await response.json();
    console.log(courses);

    return { success: true, data: courses };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: 'Invalid search query.' };
    }

    console.error('Error in searchCoursesForCommand:', error);

    return { error: 'An error occurred while searching.' };
  }
}
