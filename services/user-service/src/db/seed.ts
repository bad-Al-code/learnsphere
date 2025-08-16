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
    console.log(`Seed listener received user: ${data.email}`);
    receivedUsers.push(data);
  }
}

async function seedProfiles() {
  if (receivedUsers.length === 0) {
    console.log('No users were received to create profiles for.');
    return;
  }
  console.log(`Creating profiles for ${receivedUsers.length} users...`);

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
        twitter: `https://twitter.com/${faker.internet.userName()}`,
        linkedin: `https://linkedin.com/in/${faker.internet.userName()}`,
        github: `https://github.com/${faker.internet.userName()}`,
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
    console.log(`Inserting ${profileData.length} profile records...`);
    for (let i = 0; i < profileData.length; i += 500) {
      const batch = profileData.slice(i, i + 500);
      await db.insert(profiles).values(batch).onConflictDoNothing();
      console.log(`Batch ${i / 500 + 1} inserted.`);
    }
    console.log(`Seeded ${profileData.length} profiles.`);
  }
}

async function runSeed() {
  try {
    console.log('Starting rich DB seed for user-service...');
    await rabbitMQConnection.connect();

    console.log('Clearing existing profiles...');
    await db.delete(profiles);

    console.log('Listening for user.registered events for 20 minutes...');
    new TempUserListener().listen();
    await new Promise((resolve) => setTimeout(resolve, 1200000));

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
