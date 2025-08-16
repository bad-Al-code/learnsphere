import { faker } from '@faker-js/faker';
import { db } from '.';
import { rabbitMQConnection } from '../events/connection';
import { Listener } from '../events/listener';
import { hardcodedInstructorIds } from './ids';
import { profiles } from './schema';

interface UserRegisteredEvent {
  topic: 'user.registered';
  data: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
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
    console.log(
      'No users were received to create profiles for. Did you run the auth-service seeder first?'
    );
    return;
  }
  console.log(`Creating profiles for ${receivedUsers.length} users...`);

  const profileData = receivedUsers.map((user) => {
    const isInstructor = hardcodedInstructorIds.includes(user.id);
    let status: 'active' | 'instructor' | 'pending_instructor_review' =
      'active';
    let applicationData = null;

    if (isInstructor) {
      status = 'instructor';
    } else if (faker.number.int({ min: 1, max: 10 }) > 8) {
      status = 'pending_instructor_review';
      applicationData = {
        expertise: faker.person.jobArea(),
        experience: faker.lorem.paragraph(),
        motivation: faker.lorem.sentence(),
        submittedAt: faker.date.recent({ days: 30 }).toISOString(),
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
        .birthdate({ min: 18, max: 65, mode: 'age' })
        .toISOString(),
      lastKnownDevice: faker.helpers.arrayElement([
        'desktop',
        'mobile',
        'tablet',
      ]),
      avatarUrls: {
        small: faker.image.avatar(),
        medium: faker.image.avatar(),
        large: faker.image.avatar(),
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
        language: faker.helpers.arrayElement(['en', 'es', 'fr']),
        notifications: {
          newCourseAlerts: faker.datatype.boolean(),
          weeklyNewsletter: faker.datatype.boolean(),
        },
      },
    };
  });

  if (profileData.length > 0) {
    await db.insert(profiles).values(profileData).onConflictDoNothing();
    console.log(`Seeded ${profileData.length} profiles.`);
  }
}

async function runSeed() {
  try {
    console.log('Starting rich DB seed for user-service...');
    await rabbitMQConnection.connect();

    console.log('Clearing existing profiles...');
    await db.delete(profiles);

    console.log('Listening for user.registered events for 60 seconds...');
    new TempUserListener().listen();
    await new Promise((resolve) => setTimeout(resolve, 60000));

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
