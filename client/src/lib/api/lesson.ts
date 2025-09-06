'use client';

import { courseService } from './client';

export async function getLesson(lessonId: string) {
  try {
    const response = await courseService.get(`/api/lessons/${lessonId}`);

    if (!response.ok) {
      throw new Error('Failed to fetch lesson details.');
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching lesson details for ${lessonId}:`, error);

    throw error;
  }
}
