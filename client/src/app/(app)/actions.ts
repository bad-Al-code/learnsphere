'use server';

import {
  courseService,
  enrollmentService,
  paymentService,
  userService,
} from '@/lib/api';

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
  const [
    topStudentsData,
    moduleProgressData,
    weeklyEngagementData,
    learningAnalyticsRes,
  ] = await Promise.all([
    (async () => {
      const topStudentsResponse = await enrollmentService.get(
        '/api/analytics/instructor/top-students'
      );
      if (!topStudentsResponse.ok) return [];

      const rawTopStudents = await topStudentsResponse.json();
      if (rawTopStudents.length === 0) return [];

      const studentIds = rawTopStudents.map((s: any) => s.userId);
      const courseIds = rawTopStudents.map((s: any) => s.courseId);

      const [userProfilesRes, courseDetailsRes] = await Promise.all([
        userService.post('/api/users/bulk', { userIds: studentIds }),
        courseService.post('/api/courses/bulk', { courseIds: courseIds }),
      ]);

      const userProfiles: BulkUser[] = userProfilesRes.ok
        ? await userProfilesRes.json()
        : [];
      const courseDetails: BulkCourse[] = courseDetailsRes.ok
        ? await courseDetailsRes.json()
        : [];

      const userMap = new Map(userProfiles.map((u) => [u.userId, u]));
      const courseMap = new Map(courseDetails.map((c) => [c.id, c]));

      return rawTopStudents.map((student: any) => {
        const user = userMap.get(student.userId);
        const course = courseMap.get(student.courseId);
        return {
          student: {
            name: user
              ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
              : 'Unknown Student',
            avatarUrl: user?.avatarUrls?.small,
          },
          course: course?.title || 'Unknown Course',
          progress: parseFloat(student.progress),
          grade: 'B+', // Placeholder
          lastActive: student.lastActive,
        };
      });
    })(),

    (async () => {
      const moduleProgressResponse = await enrollmentService.get(
        '/api/analytics/instructor/module-progress'
      );
      if (!moduleProgressResponse.ok) return [];
      return moduleProgressResponse.json();
    })(),

    (async () => {
      const response = await enrollmentService.get(
        '/api/analytics/instructor/weekly-engagement'
      );
      if (!response.ok) return [];
      return response.json();
    })(),

    (async () => {
      const response = await courseService.get(
        '/api/analytics/instructor/learning-analytics'
      );
      if (!response.ok) return [];
      return response.json();
    })(),
  ]);

  let learningAnalyticsData = [
    { subject: 'Content Engagement', current: 85, target: 90 },
    { subject: 'Quiz Performance', current: 78, target: 80 },
    { subject: 'Discussion Quality', current: 70, target: 75 },
    { subject: 'Assignment Timeliness', current: 0, target: 95 },
    { subject: 'Resource Utilization', current: 0, target: 70 },
    { subject: 'Avg Session Duration', current: 88, target: 85 },
  ];

  if (learningAnalyticsRes) {
    learningAnalyticsData[3].current = (learningAnalyticsRes as any).timeliness;
    learningAnalyticsData[4].current = (
      learningAnalyticsRes as any
    ).utilization;
  }

  return {
    weeklyEngagement: weeklyEngagementData || [],
    learningAnalytics: learningAnalyticsData,
    moduleProgress: moduleProgressData || [],
    topStudents: topStudentsData || [],
  };
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
