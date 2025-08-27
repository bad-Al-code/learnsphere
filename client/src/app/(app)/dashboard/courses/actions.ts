'use server';

import { courseService, enrollmentService, paymentService } from '@/lib/api';
import { CourseFormValues, courseSchema } from '@/lib/schemas/course';
import { CourseFilterOptions } from '@/types/course';
import { faker } from '@faker-js/faker';
import { revalidatePath } from 'next/cache';

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

// export async function getCourseOverviewData(courseId: string) {
//   const seededFaker = faker;
//   seededFaker.seed(
//     courseId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
//   );

//   const stats = {
//     studentsEnrolled: {
//       value: seededFaker.number.int({ min: 50, max: 500 }),
//       change: seededFaker.number.int({ min: -15, max: 25 }),
//     },
//     completionRate: {
//       value: seededFaker.number.int({ min: 60, max: 95 }),
//       change: seededFaker.number.int({ min: -5, max: 10 }),
//     },
//     averageRating: {
//       value: seededFaker.number.float({
//         min: 3.8,
//         max: 4.9,
//         fractionDigits: 1,
//       }),
//       reviews: seededFaker.number.int({ min: 10, max: 200 }),
//     },
//     revenue: {
//       value: seededFaker.number.int({ min: 1000000, max: 500000000 }),
//       change: seededFaker.number.int({ min: -15, max: 25 }),
//     },
//     avgSessionTime: {
//       value: `${seededFaker.number.int({ min: 8, max: 25 })}m`,
//       change: seededFaker.number.int({ min: -10, max: 15 }),
//     },
//     forumActivity: { value: seededFaker.number.int({ min: 20, max: 150 }) },
//     resourceDownloads: {
//       value: seededFaker.number.int({ min: 100, max: 1000 }),
//       change: seededFaker.number.int({ min: -10, max: 30 }),
//     },
//   };

//   const recentActivity = Array.from({ length: 3 }, () => ({
//     user: { name: seededFaker.person.fullName(), image: faker.image.avatar() },
//     action: seededFaker.helpers.arrayElement([
//       'enrolled in the course',
//       'completed a lesson',
//       'posted a comment',
//     ]),
//     timestamp: faker.date.recent({ days: 7 }),
//   }));

//   const topPerformers = Array.from({ length: 3 }, () => ({
//     student: {
//       name: seededFaker.person.fullName(),
//       avatarUrl: faker.image.avatar(),
//     },
//     progress: seededFaker.number.int({ min: 90, max: 100 }),
//     grade: faker.helpers.arrayElement(['A+', 'A', 'A-']),
//     lastActive: faker.date.recent({ days: 3 }),
//   }));

//   const modulePerformance = Array.from({ length: 4 }, (_, i) => ({
//     module: `Module ${i + 1}: ${seededFaker.lorem.words(3)}`,
//     completionRate: seededFaker.number.int({ min: 60, max: 98 }),
//     avgScore: seededFaker.number.int({ min: 75, max: 95 }),
//     timeSpent: `${seededFaker.number.int({ min: 45, max: 180 })}m`,
//     satisfaction: seededFaker.number.float({
//       min: 4.0,
//       max: 4.9,
//       fractionDigits: 1,
//     }),
//   }));

//   const assignmentStatus = Array.from({ length: 3 }, () => ({
//     assignment: seededFaker.lorem.words(4),
//     dueDate: faker.date.future({ years: 0.1 }),
//     submissions: seededFaker.number.int({
//       min: 20,
//       max: stats.studentsEnrolled.value,
//     }),
//     total: stats.studentsEnrolled.value,
//     avgGrade: faker.helpers.arrayElement(['A', 'B+', 'A-']),
//   }));

//   const studentsNeedingAttention = Array.from({ length: 2 }, () => ({
//     student: {
//       name: faker.person.fullName(),
//       avatarUrl: faker.image.avatar(),
//     },
//     course: faker.lorem.words(3).replace(/\b\w/g, (l) => l.toUpperCase()),
//     lastActive: faker.date.recent({ days: 14 }),
//     reason: faker.helpers.arrayElement([
//       'Low quiz scores',
//       'Inactive for 2 weeks',
//       'Missed deadline',
//     ]),
//     details: 'Avg score: 55%',
//   }));

//   return {
//     stats,
//     recentActivity,
//     topPerformers,
//     modulePerformance,
//     assignmentStatus,
//     studentsNeedingAttention,
//   };
// }

export async function getCourseOverviewData(courseId: string) {
  try {
    const [enrollmentStatsRes, courseDetailsRes, paymentStatsRes] =
      await Promise.all([
        enrollmentService.get(`/api/analytics/course/${courseId}/stats`),
        courseService.get(`/api/courses/${courseId}`),
        paymentService.get(
          `/api/payments/analytics/course/${courseId}/revenue`
        ),
      ]);

    if (!enrollmentStatsRes.ok)
      throw new Error('Failed to fetch enrollment stats.');
    if (!courseDetailsRes.ok)
      throw new Error('Failed to fetch course details.');
    if (!paymentStatsRes.ok) throw new Error('Failed to fetch payment stats.');

    const courseDetails = await courseDetailsRes.json();
    const enrollmentStats = await enrollmentStatsRes.json();
    const paymentStats = await paymentStatsRes.json();

    const data = {
      details: {
        title: courseDetails.title,
        description: courseDetails.description,
      },
      stats: {
        studentsEnrolled: {
          value: enrollmentStats.totalStudents,
          change: 0, // Placeholder
        },
        completionRate: {
          value: parseFloat(enrollmentStats.avgCompletion).toFixed(1),
          change: 0, // Placeholder
        },
        averageRating: {
          value: courseDetails.averageRating || 4.5,
          reviews: 150,
        }, // Placeholder
        revenue: { value: paymentStats.totalRevenue || 0, change: 10 }, // Placeholder
        avgSessionTime: { value: '15m', change: 5 }, // Placeholder
        forumActivity: { value: 42 }, // Placeholder
        resourceDownloads: { value: 250, change: 15 }, // Placeholder
      },

      recentActivity: [],
      topPerformers: [],
      modulePerformance: [],
      assignmentStatus: [],
      studentsNeedingAttention: [],
    };

    return data;
  } catch (error: any) {
    console.error(
      `Error fetching overview data for course ${courseId}:`,
      error
    );

    return {
      details: null,
      stats: {
        studentsEnrolled: { value: 0, change: 0 },
        completionRate: { value: 0, change: 0 },
        averageRating: { value: 0, reviews: 0 },
        revenue: { value: 0, change: 0 },
        avgSessionTime: { value: '0m', change: 0 },
        forumActivity: { value: 0 },
        resourceDownloads: { value: 0, change: 0 },
      },
      recentActivity: [],
      topPerformers: [],
      modulePerformance: [],
      assignmentStatus: [],
      studentsNeedingAttention: [],
    };
  }
}
