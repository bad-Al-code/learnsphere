'use server';

import { unstable_noStore as noStore } from 'next/cache';

import {
  courseService,
  enrollmentService,
  paymentService,
  userService,
} from '@/lib/api/server';

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
    const [
      trendsResponse,
      breakdownResponse,
      financialsResponse,
      demographicsResponse,
    ] = await Promise.all([
      enrollmentService.get('/api/analytics/instructor/trends'),
      paymentService.get(
        '/api/payments/analytics/instructor/revenue-breakdown'
      ),
      paymentService.get('/api/payments/analytics/instructor/financials'),
      enrollmentService.get('/api/analytics/instructor/demographics'),
    ]);

    let trendsData = [];
    if (trendsResponse.ok) {
      trendsData = await trendsResponse.json();
    } else {
      console.error('Failed to fetch instructor trends');
    }

    let breakdownData = [];
    if (breakdownResponse.ok) {
      breakdownData = await breakdownResponse.json();
    } else {
      console.error('Failed to fetch revenue breakdown');
    }

    let financialsData = [];
    if (financialsResponse.ok) {
      financialsData = await financialsResponse.json();
    } else {
      console.error('Failed to fetch financial trends');
    }

    let demographicsData = [];
    let deviceUsageData = [];
    if (demographicsResponse.ok) {
      const data = await demographicsResponse.json();
      demographicsData = data.demographics;
      deviceUsageData = data.deviceUsage;
    } else {
      console.error('Failed to fetch demographic stats');
    }

    return {
      trends: trendsData,
      breakdown: breakdownData,
      financials: financialsData,
      demographics: demographicsData,
      deviceUsage: deviceUsageData,
    };
  } catch (error) {
    console.error('Error fetching instructor chart data:', error);
    return {
      trends: [],
      breakdown: [],
      financials: [],
      demographics: [],
      deviceUsage: [],
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
    const performanceData: {
      courseId: string;
      averageCompletion: number;
      studentCount: number;
    }[] = await performanceRes.json();

    const performanceMap = new Map(
      performanceData.map((p) => [
        p.courseId,
        { completion: p.averageCompletion, students: p.studentCount },
      ])
    );

    const chartData = courses.map((course: any) => ({
      name: course.title,
      completionRate: performanceMap.get(course.id)?.completion || 0,
      students: performanceMap.get(course.id)?.students || 0,
      rating: course.averageRating || 0,
    }));

    return chartData;
  } catch (error) {
    console.error('Error fetching course performance data:', error);
    return [];
  }
}

interface BulkUser {
  userId: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrls?: { small?: string };
}

interface BulkCourse {
  id: string;
  title: string;
}

export async function getEngagementData() {
  try {
    const [
      weeklyEngagementRes,
      topStudentsRes,
      moduleProgressRes,
      learningAnalyticsRes,
      discussionEngagementRes,
    ] = await Promise.all([
      enrollmentService.get('/api/analytics/instructor/weekly-engagement'),
      enrollmentService.get('/api/analytics/instructor/top-students'),
      enrollmentService.get('/api/analytics/instructor/module-progress'),
      courseService.get('/api/analytics/instructor/learning-analytics'),
      enrollmentService.get('/api/analytics/instructor/discussion-engagement'),
    ]);

    if (!weeklyEngagementRes.ok)
      throw new Error('Failed to fetch weekly engagement');
    if (!topStudentsRes.ok) throw new Error('Failed to fetch top students');
    if (!moduleProgressRes.ok)
      throw new Error('Failed to fetch module progress');
    if (!learningAnalyticsRes.ok)
      throw new Error('Failed to fetch learning analytics');
    if (!discussionEngagementRes.ok)
      throw new Error('Failed to fetch discussion engagement');

    const weeklyEngagementData = await weeklyEngagementRes.json();
    const rawTopStudents = await topStudentsRes.json();
    const moduleProgressData = await moduleProgressRes.json();
    const learningAnalyticsRaw = await learningAnalyticsRes.json();
    const discussionEngagement = await discussionEngagementRes.json();

    let topStudentsData: any[] = [];
    if (rawTopStudents.length > 0) {
      const studentIds = rawTopStudents.map((s: any) => s.userId);
      const courseIds = [
        ...new Set(rawTopStudents.map((s: any) => s.courseId)),
      ];

      const [userProfilesRes, courseDetailsRes] = await Promise.all([
        userService.post('/api/users/bulk', { userIds: studentIds }),
        courseService.post('/api/courses/bulk', { courseIds }),
      ]);

      const userProfiles: BulkUser[] = userProfilesRes.ok
        ? await userProfilesRes.json()
        : [];
      const courseDetails: BulkCourse[] = courseDetailsRes.ok
        ? await courseDetailsRes.json()
        : [];

      const userMap = new Map(userProfiles.map((u) => [u.userId, u]));
      const courseMap = new Map(courseDetails.map((c) => [c.id, c]));

      const gradePromises = rawTopStudents.map((student: any) =>
        enrollmentService
          .get(
            `/api/analytics/instructor/student-grade/${student.courseId}/${student.userId}`
          )
          .then((res) => (res.ok ? res.json() : { letterGrade: null }))
      );

      const grades = await Promise.all(gradePromises);

      topStudentsData = rawTopStudents.map((student: any, index: number) => {
        const user = userMap.get(student.userId);
        const course = courseMap.get(student.courseId);
        const gradeInfo = grades[index];

        return {
          student: {
            name: user
              ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
              : 'Unknown Student',
            avatarUrl: user?.avatarUrls?.small,
          },
          course: course?.title || 'Unknown Course',
          progress: parseFloat(student.progress),
          grade: gradeInfo.letterGrade || 'N/A',
          lastActive: student.lastActive,
        };
      });
    }

    const learningAnalyticsData = [
      { subject: 'Content Engagement', current: 85, target: 90 }, // Placeholder
      { subject: 'Quiz Performance', current: 78, target: 80 }, // Placeholder
      {
        subject: 'Discussion Quality',
        current: discussionEngagement.engagementScore || 0,
        target: 75,
      }, // Placeholder
      {
        subject: 'Assignment Timeliness',
        current: (learningAnalyticsRaw as any).timeliness || 0,
        target: 95,
      },
      {
        subject: 'Resource Utilization',
        current: (learningAnalyticsRaw as any).utilization || 0,
        target: 70,
      },
      { subject: 'Avg Session Duration', current: 88, target: 85 }, // Placeholder
    ];

    return {
      weeklyEngagement: weeklyEngagementData || [],
      learningAnalytics: learningAnalyticsData,
      moduleProgress: moduleProgressData || [],
      topStudents: topStudentsData,
    };
  } catch (error: any) {
    console.error('Error fetching engagement data:', error);
    return { error: error.message || 'Failed to load engagement data.' };
  }
}

export async function getPerformanceTabData() {
  try {
    const response = await courseService.get(
      '/api/analytics/instructor/content-performance'
    );
    if (!response.ok) {
      console.error('Failed to fetch content performance data');
      return { contentPerformance: [], kpis: [] };
    }
    const data = await response.json();

    const kpiData = [
      {
        title: 'Average Time Spent',
        value: '2h 30m',
        change: 10,
        target: '2h 45m',
      },
      { title: 'Quiz Success Rate', value: '85%', change: 3, target: '80%' },
      {
        title: 'Assignment Completion',
        value: '78%',
        change: -2,
        target: '85%',
      },
      {
        title: 'Discussion Participation',
        value: '65%',
        change: 8,
        target: '70%',
      },
      { title: 'Video Watch Time', value: '92%', change: 5, target: '90%' },
      {
        title: 'Resource Downloads',
        value: '1,240',
        change: 15,
        target: '1,000',
      },
      { title: 'Forum Posts', value: '2,850', change: 12, target: '2,500' },
      {
        title: 'Live Session Attendance',
        value: '68%',
        change: 6,
        target: '75%',
      },
      {
        title: 'Certificate Completion',
        value: '52%',
        change: 8,
        target: '60%',
      },
    ];

    return { contentPerformance: data, kpis: kpiData };
  } catch (error) {
    console.error('Error fetching performance tab data:', error);
    return { contentPerformance: [], kpis: [] };
  }
}

async function fetchData(serviceCall: Promise<Response>) {
  noStore();
  try {
    const response = await serviceCall;
    if (!response.ok) {
      console.error(
        `API call failed with status ${response.status}:`,
        await response.text()
      );
      return { success: false, data: null, error: 'Failed to fetch data.' };
    }
    const data = await response.json();
    return { success: true, data, error: null };
  } catch (error: any) {
    console.error('An unexpected error occurred during API call:', error);
    return {
      success: false,
      data: null,
      error: error.message || 'An unexpected server error occurred.',
    };
  }
}

export async function getWeeklyEngagement(instructorId: string) {
  return fetchData(
    enrollmentService.get(
      `/api/analytics/instructor/weekly-engagement?instructorId=${instructorId}`
    )
  );
}

export async function getTopStudents(instructorId: string) {
  return fetchData(
    enrollmentService.get(
      `/api/analytics/instructor/top-students?instructorId=${instructorId}`
    )
  );
}

export async function getModuleProgress(instructorId: string) {
  return fetchData(
    enrollmentService.get(
      `/api/analytics/instructor/module-progress?instructorId=${instructorId}`
    )
  );
}

export async function getRevenueBreakdown(instructorId: string) {
  return fetchData(
    paymentService.get(
      `/api/payments/analytics/instructor/revenue-breakdown?instructorId=${instructorId}`
    )
  );
}

export async function getFinancialTrends(instructorId: string) {
  return fetchData(
    paymentService.get(
      `/api/payments/analytics/instructor/financials?instructorId=${instructorId}`
    )
  );
}
