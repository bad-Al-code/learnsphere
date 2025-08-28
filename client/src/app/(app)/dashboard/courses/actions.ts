'use server';

import {
  courseService,
  enrollmentService,
  paymentService,
  userService,
} from '@/lib/api';
import { CourseFormValues, courseSchema } from '@/lib/schemas/course';
import { moduleSchema, ModuleSchemaValues } from '@/lib/schemas/module';
import { CourseFilterOptions } from '@/types/course';
import { BulkUser } from '@/types/user';
import { faker } from '@faker-js/faker';
import { revalidatePath } from 'next/cache';
import z from 'zod';

export async function getMyCoursePageStats() {
  await new Promise((resolve) => setTimeout(resolve, 3000));

  return {
    totalCourses: {
      value: faker.number.int({ min: 5, max: 20 }),
      change: faker.number.int({ min: -15, max: 25 }),
      breakdown: {
        published: 5,
        draft: 1,
      },
    },

    totalEnrollments: {
      value: faker.number.int({ min: 500, max: 2500 }),
      change: faker.number.int({ min: -15, max: 25 }),
    },

    avgCompletion: {
      value: faker.number.int({ min: 60, max: 95 }),
      change: faker.number.int({ min: -5, max: 10 }),
    },
    totalRevenue: {
      value: faker.number.int({ min: 50000, max: 250000 }),
      change: faker.number.int({ min: -15, max: 25 }),
    },
  };
}

export async function createFullCourse(values: CourseFormValues) {
  try {
    const validatedData = courseSchema.parse(values);
    const response = await courseService.post(
      '/api/courses/full',
      validatedData
    );

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.errors?.[0]?.message || 'Failed to create course.');
    }

    const newCourse = await response.json();

    revalidatePath('/dashboard/courses');

    return { success: true, data: newCourse };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function getMyCourses(options: CourseFilterOptions = {}) {
  try {
    const params = new URLSearchParams();
    if (options.query) params.set('q', options.query);
    if (options.status) params.set('status', options.status);
    if (options.page) params.set('page', String(options.page));

    params.set('limit', String(options.limit || 10));

    const response = await courseService.get(
      `/api/courses/my-courses?${params.toString()}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch instructor courses.');
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('Failed to fetch instructor courses:', error);
    return {
      results: [],
      pagination: { currentPage: 1, totalPages: 1, totalResults: 0 },
    };
  }
}

export async function getCourseDetailsForEditor(courseId: string) {
  try {
    const response = await courseService.get(`/api/courses/${courseId}`);
    if (!response.ok) {
      throw new Error('Course not found.');
    }
    return { success: true, data: await response.json() };
  } catch (error: any) {
    console.error(
      `Error fetching course details for editor: ${courseId}`,
      error
    );
    return { error: error.message };
  }
}

export async function getCourseOverviewData(courseId: string) {
  const safeFetch = async (
    fetchPromise: Promise<Response>,
    serviceName: string
  ) => {
    try {
      const response = await fetchPromise;
      if (!response.ok) {
        console.error(
          `Failed to fetch from ${serviceName}: ${response.statusText}`
        );
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error(`Error connecting to ${serviceName}:`, error);
      return null;
    }
  };

  const [
    enrollmentStats,
    courseDetails,
    paymentStats,
    studentPerformance,
    activityStats,
    modulePerformance,
    assignmentStatus,
    revenueTrend,
    avgSessionTime,
    timeSpentRes,
  ] = await Promise.all([
    safeFetch(
      enrollmentService.get(`/api/analytics/course/${courseId}/stats`),
      'enrollment-stats'
    ),
    safeFetch(courseService.get(`/api/courses/${courseId}`), 'course-details'),
    safeFetch(
      paymentService.get(`/api/payments/analytics/course/${courseId}/revenue`),
      'payment-stats'
    ),
    safeFetch(
      enrollmentService.get(
        `/api/analytics/course/${courseId}/student-performance`
      ),
      'student-performance'
    ),
    safeFetch(
      enrollmentService.get(`/api/analytics/course/${courseId}/activity-stats`),
      'activity-stats'
    ),
    safeFetch(
      enrollmentService.get(
        `/api/analytics/course/${courseId}/module-performance`
      ),
      'module-performance'
    ),
    safeFetch(
      courseService.get(`/api/courses/${courseId}/assignment-status`),
      'assignment-status'
    ),
    safeFetch(
      paymentService.get(
        `/api/payments/analytics/course/${courseId}/revenue-trend`
      ),
      'revenue-trend'
    ),
    safeFetch(
      enrollmentService.get(`/api/analytics/course/${courseId}/session-time`),
      'session-time'
    ),
    safeFetch(
      enrollmentService.get(`/api/analytics/course/${courseId}/time-spent`),
      'time-spent'
    ),
  ]);

  if (!courseDetails) {
    throw new Error('Failed to fetch essential course details.');
  }

  const allStudentIds = [
    ...(studentPerformance?.topPerformers.map((s: any) => s.userId) || []),
    ...(studentPerformance?.studentsAtRisk.map((s: any) => s.userId) || []),
  ];
  const uniqueStudentIds = [...new Set(allStudentIds)];

  let userMap = new Map<string, BulkUser>();
  if (uniqueStudentIds.length > 0) {
    const userProfiles: BulkUser[] | null = await safeFetch(
      userService.post('/api/users/bulk', { userIds: uniqueStudentIds }),
      'user-bulk-profiles'
    );
    if (userProfiles) {
      userMap = new Map(userProfiles.map((u) => [u.userId, u]));
    }
  }

  const mapStudentData = (student: any) => {
    const user = userMap.get(student.userId);
    const lastActivityEntry = activityStats.recentActivity.find(
      (a: any) => a.userId === student.userId
    );

    return {
      student: {
        name: user
          ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
          : 'Unknown Student',
        avatarUrl: user?.avatarUrls?.small,
      },
      progress: parseFloat(student.progressPercentage),
      grade:
        student.averageGrade != null && !isNaN(Number(student.averageGrade))
          ? `${Number(student.averageGrade).toFixed(1)}%`
          : 'N/A',

      // Placeholder
      lastActive: lastActivityEntry
        ? new Date(lastActivityEntry.createdAt)
        : new Date(),
      reason: 'Low Progress',
      details: `Avg. Grade: ${
        student.averageGrade != null && !isNaN(Number(student.averageGrade))
          ? Number(student.averageGrade).toFixed(1)
          : 'N/A'
      }%`,
    };
  };

  const topPerformers =
    studentPerformance?.topPerformers.map(mapStudentData) || [];
  const studentsNeedingAttention =
    studentPerformance?.studentsAtRisk.map(mapStudentData) || [];

  const recentActivityUserIds = activityStats.recentActivity.map(
    (a: any) => a.userId
  );
  let recentActivityUserMap = new Map<string, BulkUser>();
  if (recentActivityUserIds.length > 0) {
    const userProfilesRes = await userService.post('/api/users/bulk', {
      userIds: recentActivityUserIds,
    });

    if (userProfilesRes.ok) {
      const userProfiles: BulkUser[] = await userProfilesRes.json();

      recentActivityUserMap = new Map(userProfiles.map((u) => [u.userId, u]));
    }
  }

  const recentActivity =
    activityStats.recentActivity.map((activity: any) => {
      const user = recentActivityUserMap.get(activity.userId);
      let actionText = activity.activityType.replace('_', ' ');

      return {
        user: {
          name: user
            ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
            : 'A Student',
          image: user?.avatarUrls?.small,
        },
        action: actionText,
        timestamp: new Date(activity.createdAt),
      };
    }) || [];

  const moduleTitleMap = new Map(
    courseDetails.modules.map((m: any) => [m.id, m.title])
  );

  const timeSpentMap = new Map(
    timeSpentRes?.modulePerformance.map((m: any) => [
      m.moduleId,
      m.timeSpent,
    ]) || []
  );

  const enrichedModulePerformance =
    modulePerformance.map((perf: any) => ({
      ...perf,
      module: moduleTitleMap.get(perf.moduleId) || 'Unknown Module',
      timeSpent: timeSpentMap.get(perf.moduleId) || '0m',
    })) || [];

  const assignmentStatusData =
    assignmentStatus.map((a: any) => ({
      assignment: a.title,
      dueDate: new Date(a.dueDate),
      submissions: a.totalSubmissions,
      total: enrollmentStats.totalStudents,
      avgGrade: a.averageGrade
        ? `${parseFloat(a.averageGrade).toFixed(1)}%`
        : 'N/A',
    })) || [];

  const data = {
    details: {
      title: courseDetails.title,
      description: courseDetails.description,
    },

    stats: {
      studentsEnrolled: {
        value: enrollmentStats.totalStudents,
        change: activityStats.enrollmentChange,
      },

      completionRate: {
        value: parseFloat(enrollmentStats.avgCompletion).toFixed(1),
        change: enrollmentStats.completionRateChange || 0,
      },

      averageRating: {
        value: courseDetails.averageRating || 4.5,
        reviews: 150,
      }, // Placeholder
      revenue: {
        value: paymentStats.totalRevenue || 0,
        change: revenueTrend.change || 0,
      },
      avgSessionTime: timeSpentRes?.avgSessionTime || {
        value: '0m',
        change: 0,
      },
      forumActivity: { value: activityStats.totalDiscussions },
      resourceDownloads: {
        value: activityStats.resourceDownloads.value,
        change: activityStats.resourceDownloads.change,
      },
    },

    recentActivity,
    topPerformers,
    modulePerformance: enrichedModulePerformance,
    assignmentStatus: assignmentStatusData,
    studentsNeedingAttention,
  };

  return data;
}

export async function getCourseDetails(courseId: string) {
  try {
    const response = await courseService.get(`/api/courses/${courseId}`);
    if (!response.ok) {
      throw new Error('Course not found.');
    }

    const result = await response.json();
    // console.log(result);

    return result;
  } catch (error) {
    console.error(`Error fetching course details for ${courseId}`);

    return null;
  }
}

export async function getCourseForEditor(courseId: string) {
  try {
    const response = await courseService.get(`/api/courses/${courseId}`);
    if (!response.ok) {
      throw new Error('Course not found.');
    }
    const course = await response.json();
    return { success: true, data: course };
  } catch (error: any) {
    console.error(`Error fetching course for editor: ${courseId}`, error);
    return { error: error.message };
  }
}

export async function createModule(
  courseId: string,
  values: ModuleSchemaValues
) {
  try {
    const validatedData = moduleSchema.parse(values);

    const response = await courseService.post(
      `/api/courses/${courseId}/modules`,
      validatedData
    );

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.errors?.[0]?.message || 'Failed to create module.');
    }

    revalidatePath(`/dashboard/courses/${courseId}`);

    return { success: true, data: await response.json() };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: error.message };
  }
}
