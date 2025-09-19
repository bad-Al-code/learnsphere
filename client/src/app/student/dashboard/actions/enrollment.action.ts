'use server';

import { getMyEnrolledCourses } from '../api/enrollment.api';

export const getMyEnrolledCoursesAction = async () => {
  try {
    const data = await getMyEnrolledCourses();

    // revalidatePath('/student/dashboard');
    return { data };
  } catch (error) {
    console.error('Failed to fetch enrolled courses:', error);

    return { error: 'Could not retrieve your courses.' };
  }
};
