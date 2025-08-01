import { faker } from '@faker-js/faker';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { courses } from './schema';

const client = new Client({
  host: 'localhost',
  port: 5434,
  user: 'postgres',
  password: 'postgres',
  database: 'course_db',
});

const db = drizzle(client);

const dummyInstructorIds = Array.from({ length: 50 }, () =>
  faker.string.uuid()
);

type Status = 'draft' | 'published';

function getRandomStatus(): Status {
  return faker.helpers.arrayElement(['draft', 'published']);
}

async function main() {
  await client.connect();

  const allCourses: (typeof courses.$inferInsert)[] = [];

  for (let i = 0; i < 500; i++) {
    const id = faker.string.uuid();
    const prerequisiteCourseId =
      i > 0 && Math.random() < 0.2
        ? allCourses[Math.floor(Math.random() * allCourses.length)].id
        : null;

    allCourses.push({
      id,
      title: faker.company.catchPhrase(),
      description: faker.lorem.paragraphs(2),
      instructorId: faker.helpers.arrayElement(dummyInstructorIds),
      status: getRandomStatus(),
      prerequisiteCourseId,
      createdAt: faker.date.past(),
      updatedAt: new Date(),
    });
  }

  await db.insert(courses).values(allCourses);
  console.log('Seeded 500 courses');

  await client.end();
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  client.end();
});
