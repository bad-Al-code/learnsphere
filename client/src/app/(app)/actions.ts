'use server';

import { courseService, enrollmentService } from '@/lib/api';

export async function getInstructorDashboardStats() {
  try {
    const [enrollmentStatsRes, courseStatsRes] = await Promise.all([
      enrollmentService.get('/api/analytics/instructor'),
      courseService.get('/api/courses/stats'),
    ]);

    let enrollmentData = { stats: { totalStudents: 0, totalRevenue: 0 } };
    let courseData = { totalCourses: 0 };

    if (enrollmentStatsRes.ok) {
      enrollmentData = await enrollmentStatsRes.json();
    } else {
      console.error('Failed to fetch enrollment stats');
    }

    if (courseStatsRes.ok) {
      courseData = await courseStatsRes.json();
    } else {
      console.error('Failed to fetch course stats');
    }

    return {
      totalStudents: {
        value: enrollmentData.stats.totalStudents || 0,
        change: 15, // Placeholder
      },
      totalRevenue: {
        value: enrollmentData.stats.totalRevenue || 0,
        change: 20, // Placeholder
      },
      activeCourses: {
        value: courseData.totalCourses || 0,
        change: 5, // Placeholder
      },
      averageRating: {
        value: 4.6, // Placeholder
        change: 10, // Placeholder
      },
    };
  } catch (error) {
    console.error('Error fetching instructor dashboard stats:', error);

    return {
      totalStudents: { value: 0, change: 0 },
      totalRevenue: { value: 0, change: 0 },
      activeCourses: { value: 0, change: 0 },
      averageRating: { value: 0, change: 0 },
    };
  }
}
