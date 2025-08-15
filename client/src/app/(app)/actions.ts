'use server';

import { courseService, enrollmentService } from '@/lib/api';

export async function getInstructorDashboardStats() {
  try {
    const [enrollmentStatsRes, courseStatsRes] = await Promise.all([
      enrollmentService.get('/api/analytics/instructor'),
      courseService.get('/api/courses/instructor/stats'),
    ]);

    let enrollmentData = {
      stats: {
        totalStudents: { value: 0, change: 0 },
        totalRevenue: { value: 0, change: 0 },
      },
    };
    let courseData = {
      activeCourses: { value: 0, change: 0 },
      averageRating: { value: 0, change: 0 },
    };

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
      totalStudents: enrollmentData.stats.totalStudents,
      totalRevenue: enrollmentData.stats.totalRevenue,
      activeCourses: courseData.activeCourses,
      averageRating: courseData.averageRating,
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

export async function getInstructorDashboardTrends() {
  try {
    const [trendsRes, completionsRes] = await Promise.all([
      enrollmentService.get('/api/analytics/instructor/trends'),
      enrollmentService.get('/api/analytics/instructor/course-performance'),
    ]);

    if (!trendsRes.ok || !completionsRes.ok) {
      console.error('Failed to fetch instructor trends or completions');
      return [];
    }

    const [trends, completions] = await Promise.all([
      trendsRes.json(),
      completionsRes.json(),
    ]);

    const merged = trends.map((trend: any) => {
      const completionData = completions.find(
        (c: { courseId: string }) => c.courseId === trend.courseId
      );
      return {
        ...trend,
        completions: completionData?.averageCompletion ?? 0,
      };
    });

    return merged;
  } catch (error) {
    console.error('Error fetching instructor trends:', error);
    return [];
  }
}

export async function getInstructorDashboardCharts() {
  try {
    const trendsResponse = await enrollmentService.get(
      '/api/analytics/instructor/trends'
    );

    let trendsData = [];
    if (trendsResponse.ok) {
      trendsData = await trendsResponse.json();
    } else {
      console.error('Failed to fetch instructor trends');
    }

    // NOTE: This is placeholder data for the revenue breakdown chart.
    const revenueBreakdownData = [
      { name: 'Course Sales', value: 400 },
      { name: 'Certifications', value: 300 },
      { name: 'Workshops', value: 300 },
      { name: 'Consulting', value: 200 },
    ];

    return {
      trends: trendsData,
      breakdown: revenueBreakdownData,
    };
  } catch (error) {
    console.error('Error fetching instructor chart data:', error);
    return {
      trends: [],
      breakdown: [],
    };
  }
}

export async function getCoursePerformanceData() {
  try {
    const [coursesRes, performanceRes] = await Promise.all([
      courseService.get('/api/courses/my-courses?limit=5&sortBy=popularity'),
      enrollmentService.get('/api/analytics/instructor/course-performance'),
    ]);

    if (!coursesRes.ok || !performanceRes.ok) {
      console.error('Failed to fetch data for performance chart');
      return [];
    }

    const { results: courses } = await coursesRes.json();
    const performanceData: { courseId: string; averageCompletion: number }[] =
      await performanceRes.json();

    const performanceMap = new Map(
      performanceData.map((p) => [p.courseId, p.averageCompletion])
    );

    const chartData = courses.map((course: any) => ({
      name: course.title,
      completionRate: performanceMap.get(course.id) || 0,
      rating: course.averageRating || 0,
    }));

    return chartData;
  } catch (error) {
    console.error('Error fetching course performance data:', error);
    return [];
  }
}
