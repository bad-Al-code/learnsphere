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
