'use server';

import { courseService, enrollmentService, paymentService } from '@/lib/api';

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

export async function getEngagementData() {
  // NOTE: This is placeholder data.
  const weeklyEngagementData = [
    { name: 'Mon', logins: 820, avgTime: 2.2, discussions: 60 },
    { name: 'Tue', logins: 950, avgTime: 2.5, discussions: 75 },
    { name: 'Wed', logins: 780, avgTime: 2.1, discussions: 65 },
    { name: 'Thu', logins: 980, avgTime: 2.8, discussions: 80 },
    { name: 'Fri', logins: 680, avgTime: 2.5, discussions: 85 },
    { name: 'Sat', logins: 450, avgTime: 1.5, discussions: 40 },
    { name: 'Sun', logins: 520, avgTime: 1.8, discussions: 30 },
  ];

  // NOTE: This is placeholder data.
  const learningAnalyticsData = [
    { subject: 'Content Engagement', current: 85, target: 90 },
    { subject: 'Quiz Performance', current: 78, target: 80 },
    { subject: 'Discussion Quality', current: 70, target: 75 },
    { subject: 'Assignment Timeliness', current: 92, target: 95 },
    { subject: 'Resource Utilization', current: 65, target: 70 },
    { subject: 'Avg Session Duration', current: 88, target: 85 },
  ];

  // NOTE: This is placeholder data.
  const moduleProgressData = [
    { name: 'Module 1', completed: 150, inProgress: 80, notStarted: 20 },
    { name: 'Module 2', completed: 120, inProgress: 90, notStarted: 40 },
    { name: 'Module 3', completed: 100, inProgress: 70, notStarted: 80 },
    { name: 'Module 4', completed: 90, inProgress: 60, notStarted: 100 },
    { name: 'Module 5', completed: 70, inProgress: 50, notStarted: 130 },
  ];

  // NOTE: This is placeholder data.
  const topStudentsData = [
    {
      student: { name: 'Sarah Chen' },
      course: 'Data Science',
      progress: 95,
      grade: 'A+',
      lastActive: '2 hours ago',
    },
    {
      student: { name: 'Michael Rodriguez' },
      course: 'Web Development',
      progress: 92,
      grade: 'A',
      lastActive: '1 hour ago',
    },
    {
      student: { name: 'Emma Thompson' },
      course: 'Digital Marketing',
      progress: 88,
      grade: 'A-',
      lastActive: '3 hours ago',
    },
    {
      student: { name: 'David Kim' },
      course: 'Graphic Design',
      progress: 85,
      grade: 'B+',
      lastActive: '5 hours ago',
    },
    {
      student: { name: 'Lisa Wang' },
      course: 'Data Science',
      progress: 82,
      grade: 'B+',
      lastActive: '1 day ago',
    },
  ];

  return {
    weeklyEngagement: weeklyEngagementData,
    learningAnalytics: learningAnalyticsData,
    moduleProgress: moduleProgressData,
    topStudents: topStudentsData,
  };
}
