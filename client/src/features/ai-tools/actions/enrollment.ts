'use server';

import { getEnrolledCourses } from '../api/enrollment.api';

export const getEnrolledCoursesAction = async () => {
  try {
    const data = await getEnrolledCourses();

    return { data };
  } catch (error) {
    console.error('Get enrolled courses action error:', error);

    return { error: 'Failed to fetch your enrolled courses.' };
  }
};
