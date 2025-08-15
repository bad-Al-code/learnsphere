import { faker } from '@faker-js/faker';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { profiles } from './schema';

const client = new Client({
  host: 'localhost',
  port: 5433,
  user: 'postgres',
  password: 'postgres',
  database: 'user_db',
});

const db = drizzle(client);

function getRandomEnumValue<T extends string>(values: T[]): T {
  return values[Math.floor(Math.random() * values.length)];
}

type Status =
  | 'active'
  | 'instructor'
  | 'pending_instructor_review'
  | 'suspended';

async function main() {
  await client.connect();

  const statuses: Status[] = [
    'active',
    'instructor',
    'pending_instructor_review',
    'suspended',
  ];

  const data = Array.from({ length: 300 }, () => {
    const userId = faker.string.uuid();
    const dateOfBirth = faker.date
      .birthdate({ min: 18, max: 65, mode: 'age' })
      .toISOString()
      .split('T')[0];

    return {
      userId,
      email: faker.internet.email(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      bio: faker.lorem.paragraph(),
      avatarUrls: {
        small: faker.image.avatar(),
        medium: faker.image.avatar(),
        large: faker.image.avatar(),
      },
      headline: faker.person.jobTitle(),
      websiteUrl: faker.internet.url(),
      socialLinks: {
        twitter: faker.internet.url(),
        linkedin: faker.internet.url(),
        github: faker.internet.url(),
      },
      instructorApplicationData: {
        expertise: faker.person.jobArea(),
        experience: faker.lorem.sentences(2),
        motivation: faker.lorem.sentences(1),
        submittedAt: faker.date.past().toISOString(),
      },
      fcmTokens: [faker.string.uuid()],
      status: getRandomEnumValue(statuses),
      dateOfBirth: dateOfBirth,
      lastKnownDevice: faker.helpers.arrayElement([
        'desktop',
        'mobile',
        'tablet',
      ]),
      settings: {
        theme: faker.helpers.arrayElement(['light', 'dark']),
        language: faker.helpers.arrayElement(['en', 'es', 'fr']),
        notifications: {
          newCourseAlerts: faker.datatype.boolean(),
          weeklyNewsletter: faker.datatype.boolean(),
        },
      },
      createdAt: faker.date.past(),
      updatedAt: new Date(),
    };
  });

  await db.insert(profiles).values(data);

  console.log('Seeded 50 profiles');
  await client.end();
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  client.end();
});
