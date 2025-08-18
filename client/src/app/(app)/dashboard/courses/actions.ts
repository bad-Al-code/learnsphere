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
