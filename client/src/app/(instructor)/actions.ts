'use server';

import { courseService, enrollmentService } from '@/lib/api';
import { CourseFormValues, courseSchema } from '@/lib/schemas/course';
import { CourseFilterOptions } from '@/types/course';
import { revalidatePath } from 'next/cache';
import z from 'zod';

export async function getInstructorAnalytics() {
  try {
    const response = await enrollmentService.get('/api/analytics/instructor');

    if (!response.ok) {
      console.error('Failed to fetch instructor analytics, response not ok.');

      return { totalStudents: 0, totalRevenue: 0, chartData: [] };
    }

    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error('Error fetching instructor analytics:', error);

    return { totalStudents: 0, totalRevenue: 0, chartData: [] };
  }
}

export async function getMyCourses(options: CourseFilterOptions = {}) {
  try {
    const params = new URLSearchParams();

    if (options.query) params.set('q', options.query);
    if (options.categoryId) params.set('categoryId', options.categoryId);
    if (options.level) params.set('level', options.level);
    if (options.price) params.set('price', options.price);
    if (options.duration) params.set('duration', options.duration);
    if (options.sortBy) params.set('sortBy', options.sortBy);
    if (options.page) params.set('page', String(options.page));
    if (options.limit) params.set('limit', String(options.limit));

    const response = await courseService.get(
      `/api/courses/my-courses?${params.toString()}`
    );

    if (!response.ok) throw new Error('Failed to fetch courses.');
    const result = await response.json();
    console.log(result);

    return result;
  } catch (error) {
    console.error('Failed to fetch instructor courses:', error);
    return { results: [], pagination: { currentPage: 1, totalPages: 0 } };
  }
}

export async function createCourse(values: CourseFormValues) {
  try {
    const validatedData = courseSchema.parse(values);

    const response = await courseService.post('/api/courses', validatedData);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.errors?.[0]?.message || 'Failed to create course.');
    }

    const newCourse = await response.json();

    revalidatePath('/dashboard/instructor/courses');

    return { success: true, data: newCourse };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: error.message };
  }
}

export async function getCategories() {
  try {
    const response = await courseService.get('/api/categories', {
      next: { tags: ['categories'] },
    });
    if (!response.ok) throw new Error('Failed to fetch categories.');
    return { success: true, data: await response.json() };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createFullCourse(values: CourseFormValues) {
  try {
    const validatedData = courseSchema.parse(values);
    const response = await courseService.post(
      '/api/courses/full',
      validatedData
    );

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.errors?.[0]?.message || 'Failed to create course.');
    }

    const newCourse = await response.json();
    console.log(newCourse);

    revalidatePath('/dashboard/instructor/courses');

    return { success: true, data: newCourse };
  } catch (error: any) {
    return { error: error.message };
  }
}
