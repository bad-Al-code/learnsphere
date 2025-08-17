import { faker } from '@faker-js/faker';
import { db } from '.';
import { rabbitMQConnection } from '../events/connection';
import { Listener } from '../events/listener';
import { profiles } from './schema';

interface UserRegisteredEvent {
  topic: 'user.registered';
  data: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    role?: 'student' | 'instructor' | 'admin';
  };
}

const receivedUsers: UserRegisteredEvent['data'][] = [];

class TempUserListener extends Listener<UserRegisteredEvent> {
  readonly topic = 'user.registered' as const;
  queueGroupName = 'user-seed-listener';

  onMessage(data: UserRegisteredEvent['data']) {
    receivedUsers.push(data);
  }
}

async function seedProfiles() {
  if (receivedUsers.length === 0) {
    return;
  }

  const profileData = receivedUsers.map((user) => {
    const isInstructor = user.role === 'instructor';
    let status: 'active' | 'instructor' | 'pending_instructor_review' =
      'active';
    let applicationData = null;

    if (isInstructor) {
      status = 'instructor';
    } else if (Math.random() < 0.09) {
      status = 'pending_instructor_review';
      applicationData = {
        expertise: faker.person.jobArea(),
        experience: faker.lorem.paragraph(),
        motivation: faker.lorem.sentence(),
        submittedAt: faker.date.recent({ days: 180 }).toISOString(),
      };
    }

    return {
      userId: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      bio: faker.lorem.paragraph(),
      headline: faker.person.bio(),
      dateOfBirth: faker.date
        .birthdate({ min: 18, max: 70, mode: 'age' })
        .toISOString(),
      lastKnownDevice: faker.helpers.arrayElement([
        'desktop',
        'mobile',
        'tablet',
      ]),
      avatarUrls: {
        small: user.avatarUrl || faker.image.avatar(),
        medium: user.avatarUrl || faker.image.avatar(),
        large: user.avatarUrl || faker.image.avatar(),
      },
      websiteUrl: faker.internet.url(),
      socialLinks: {
        twitter: `https://twitter.com/${faker.internet.username()}`,
        linkedin: `https://linkedin.com/in/${faker.internet.username()}`,
        github: `https://github.com/${faker.internet.username()}`,
      },
      status,
      instructorApplicationData: applicationData,
      settings: {
        theme: faker.helpers.arrayElement(['light', 'dark']),
        language: faker.helpers.arrayElement(['en', 'es', 'fr', 'de', 'hi']),
        notifications: {
          newCourseAlerts: faker.datatype.boolean(),
          weeklyNewsletter: faker.datatype.boolean(),
        },
      },
    };
  });

  if (profileData.length > 0) {
    for (let i = 0; i < profileData.length; i += 500) {
      const batch = profileData.slice(i, i + 500);
      await db.insert(profiles).values(batch).onConflictDoNothing();
    }
  }
}

async function runSeed() {
  try {
    await rabbitMQConnection.connect();

    console.log('Clearing existing profiles data...');
    await db.delete(profiles);

    console.log('Listening for user events for 15 minutes...');
    new TempUserListener().listen();
    await new Promise((resolve) => setTimeout(resolve, 900000));

    await seedProfiles();

    console.log('User-service data seeded successfully.');
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  } finally {
    await rabbitMQConnection.close();
    process.exit(0);
  }
}

runSeed();
