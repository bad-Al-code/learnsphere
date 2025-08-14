'use server';

import { courseService, enrollmentService } from '@/lib/api';

export async function getInstructorDashboardStats() {
  try {
    const [enrollmentStatsRes, courseStatsRes] = await Promise.all([
      enrollmentService.get('/api/analytics/instructor'),
      courseService.get('/api/courses/stats'),
    ]);

    if (!enrollmentStatsRes.ok || !courseStatsRes.ok) {
      console.error('Failed to fetch some dashboard stats');

      return {
        totalStudents: 0,
        totalRevenue: 0,
        activeCourses: 0,
        averageRating: 0,
      };
    }

    const enrollmentData = await enrollmentStatsRes.json();
    const courseData = await courseStatsRes.json();

    return {
      totalStudents: enrollmentData.stats.totalStudents || 0,
      totalRevenue: enrollmentData.stats.totalRevenue || 0,
      activeCourses: courseData.totalCourses || 0,
      averageRating: 4.6,
    };
  } catch (error) {
    console.error('Error fetching instructor dashboard stats:', error);

    return {
      totalStudents: 0,
      totalRevenue: 0,
      activeCourses: 0,
      averageRating: 0,
    };
  }
}
