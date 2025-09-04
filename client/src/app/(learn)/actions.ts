'use server';

import { courseService, enrollmentService } from '@/lib/api/server';
import { revalidatePath } from 'next/cache';

export async function checkEnrollmentStatus(courseId: string) {
  try {
    const response = await enrollmentService.get(
      `/api/enrollments/check/${courseId}`
    );
    if (!response.ok) return null;

    const result = await response.json();

    return result;
  } catch (error) {
    return null;
  }
}

export async function getLessonDetails(lessonId: string) {
  try {
    const response = await courseService.get(`/api/lessons/${lessonId}`);
    if (!response.ok) return null;

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Error fetching lesson details for ${lessonId}:`, error);
    return null;
  }
}

export async function getEnrollmentProgress(courseId: string) {
  try {
    const response = await enrollmentService.get(
      `/api/enrollments/check/${courseId}`
    );
    if (!response.ok) return null;

    const result = await response.json();
    return result;
  } catch (error) {
    return null;
  }
}

export async function markLessonComplete(courseId: string, lessonId: string) {
  try {
    const response = await enrollmentService.post('/api/enrollments/progress', {
      courseId,
      lessonId,
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));

      return {
        error: data.errors?.[0]?.message || 'Failed to mark as complete.',
      };
    }

    revalidatePath(`/learn/${courseId}`, 'layout');

    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}
