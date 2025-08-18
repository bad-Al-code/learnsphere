import { Course } from '@/types/course';
import { faker } from '@faker-js/faker';

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

export async function getMyCourses(options: {
  query?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  const { query, status, page = 1, limit = 6 } = options;

  await new Promise((resolve) => setTimeout(resolve, 1200));

  const allCourses: Course[] = Array.from({ length: 25 }, (_, i) => ({
    id: faker.string.uuid(),
    title: faker.lorem.words(3).replace(/\b\w/g, (l) => l.toUpperCase()),
    description: faker.lorem.sentence(),
    status: i % 3 === 0 ? 'draft' : 'published',
    imageUrl: `https://picsum.photos/seed/${faker.string.alphanumeric(5)}/600/400`,
    price: faker.number.float({ min: 499, max: 2999, fractionDigits: 2 }),
    currency: 'INR',
    level: faker.helpers.arrayElement(['beginner', 'intermediate', 'advanced']),
    averageRating: faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),
    enrollmentCount: faker.number.int({ min: 50, max: 1500 }),
    modules: Array.from({ length: faker.number.int({ min: 3, max: 8 }) }),
    completionRate: faker.number.int({ min: 40, max: 95 }),
    updatedAt: faker.date.recent({ days: 30 }).toISOString(),
    instructorId: '',
  }));

  let filteredCourses = allCourses;
  if (query) {
    filteredCourses = filteredCourses.filter((c) =>
      c.title.toLowerCase().includes(query.toLowerCase())
    );
  }
  if (status && status !== 'all') {
    filteredCourses = filteredCourses.filter((c) => c.status === status);
  }

  const totalResults = filteredCourses.length;
  const totalPages = Math.ceil(totalResults / limit);
  const paginatedCourses = filteredCourses.slice(
    (page - 1) * limit,
    page * limit
  );

  return {
    results: paginatedCourses,
    pagination: {
      currentPage: page,
      totalPages: totalPages > 0 ? totalPages : 1,
    },
  };
}

export async function getCourseDetails(
  courseId: string
): Promise<Course | null> {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const seededFaker = faker;
  seededFaker.seed(
    courseId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  );

  return {
    id: courseId,
    title: seededFaker.lorem.words(3).replace(/\b\w/g, (l) => l.toUpperCase()),
    description: seededFaker.lorem.sentence(),
    status: seededFaker.helpers.arrayElement(['draft', 'published']),
    imageUrl: `https://picsum.photos/seed/${courseId}/600/400`,
    price: seededFaker.number.float({ min: 499, max: 2999, fractionDigits: 2 }),
    currency: 'INR',
    level: seededFaker.helpers.arrayElement([
      'beginner',
      'intermediate',
      'advanced',
    ]),
    averageRating: seededFaker.number.float({
      min: 3.5,
      max: 5,
      fractionDigits: 1,
    }),
    enrollmentCount: seededFaker.number.int({ min: 50, max: 1500 }),
    modules: Array.from({ length: seededFaker.number.int({ min: 3, max: 8 }) }),
    completionRate: seededFaker.number.int({ min: 40, max: 95 }),
    updatedAt: seededFaker.date.recent({ days: 30 }).toISOString(),
    instructorId: '',
  };
}

export async function getCourseOverviewData(courseId: string) {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const seededFaker = faker;
  seededFaker.seed(
    courseId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  );

  const stats = {
    studentsEnrolled: {
      value: seededFaker.number.int({ min: 50, max: 500 }),
      change: seededFaker.number.int({ min: -15, max: 25 }),
    },
    completionRate: {
      value: seededFaker.number.int({ min: 60, max: 95 }),
      change: seededFaker.number.int({ min: -5, max: 10 }),
    },
    averageRating: {
      value: seededFaker.number.float({
        min: 3.8,
        max: 4.9,
        fractionDigits: 1,
      }),
      reviews: seededFaker.number.int({ min: 10, max: 200 }),
    },
    revenue: {
      value: seededFaker.number.int({ min: 10000, max: 50000 }),
      change: seededFaker.number.int({ min: -15, max: 25 }),
    },
    avgSessionTime: {
      value: `${seededFaker.number.int({ min: 8, max: 25 })}m`,
      change: seededFaker.number.int({ min: -10, max: 15 }),
    },
    forumActivity: { value: seededFaker.number.int({ min: 20, max: 150 }) },
    resourceDownloads: {
      value: seededFaker.number.int({ min: 100, max: 1000 }),
      change: seededFaker.number.int({ min: -10, max: 30 }),
    },
  };

  const recentActivity = Array.from({ length: 3 }, () => ({
    user: { name: seededFaker.person.fullName(), image: faker.image.avatar() },
    action: seededFaker.helpers.arrayElement([
      'enrolled in the course',
      'completed a lesson',
      'posted a comment',
    ]),
    timestamp: faker.date.recent({ days: 7 }),
  }));

  const topPerformers = Array.from({ length: 3 }, () => ({
    student: {
      name: seededFaker.person.fullName(),
      avatarUrl: faker.image.avatar(),
    },
    progress: seededFaker.number.int({ min: 90, max: 100 }),
    grade: faker.helpers.arrayElement(['A+', 'A', 'A-']),
    lastActive: faker.date.recent({ days: 3 }),
  }));

  const modulePerformance = Array.from({ length: 4 }, (_, i) => ({
    module: `Module ${i + 1}: ${seededFaker.lorem.words(3)}`,
    completionRate: seededFaker.number.int({ min: 60, max: 98 }),
    avgScore: seededFaker.number.int({ min: 75, max: 95 }),
    timeSpent: `${seededFaker.number.int({ min: 45, max: 180 })}m`,
    satisfaction: seededFaker.number.float({
      min: 4.0,
      max: 4.9,
      fractionDigits: 1,
    }),
  }));

  const assignmentStatus = Array.from({ length: 3 }, () => ({
    assignment: seededFaker.lorem.words(4),
    dueDate: faker.date.future({ years: 0.1 }),
    submissions: seededFaker.number.int({
      min: 100,
      max: stats.studentsEnrolled.value,
    }),
    total: stats.studentsEnrolled.value,
    avgGrade: faker.helpers.arrayElement(['A', 'B+', 'A-']),
  }));

  const studentsNeedingAttention = Array.from({ length: 2 }, () => ({
    student: {
      name: faker.person.fullName(),
      avatarUrl: faker.image.avatar(),
    },
    course: faker.lorem.words(3).replace(/\b\w/g, (l) => l.toUpperCase()),
    lastActive: faker.date.recent({ days: 14 }),
    reason: faker.helpers.arrayElement([
      'Low quiz scores',
      'Inactive for 2 weeks',
      'Missed deadline',
    ]),
    details: 'Avg score: 55%',
  }));

  return {
    stats,
    recentActivity,
    topPerformers,
    modulePerformance,
    assignmentStatus,
    studentsNeedingAttention,
  };
}
