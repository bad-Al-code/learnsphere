import { faker } from '@faker-js/faker';
import { UAParser } from 'ua-parser-js';
import { v4 as uuidv4 } from 'uuid';

import { db } from '..';
import { rabbitMQConnection } from '../../events/connection';
import { UserRegisteredPublisher } from '../../events/publisher';
import { Password } from '../../utils/password';
import { auditLogs, users, userSessions } from '../schema';
import { ADMIN_ID, hardcodedInstructorIds, sampleUserAgents } from './ids';

type UserRole = 'admin' | 'instructor' | 'student';

const publisher = new UserRegisteredPublisher();

const DYNAMIC_USERS_TO_GENERATE = 5000;

async function createUserAndPublish(
  id: string,
  role: UserRole,
  createdAt: Date,
  details?: { firstName?: string; email?: string }
) {
  const firstName = details?.firstName || faker.person.firstName();
  const lastName = faker.person.lastName();
  const email =
    details?.email ||
    faker.internet.email({ firstName, lastName }).toLowerCase();
  const passwordHash = await Password.toHash('password');
  const avatarUrl = faker.image.avatar();

  await db
    .insert(users)
    .values({
      id,
      email,
      passwordHash,
      role,
      isVerified: true,
      createdAt,
    })
    .onConflictDoNothing();

  await db
    .insert(auditLogs)
    .values({
      userId: id,
      action: 'SIGNUP_SUCCESS',
      ipAddress: faker.internet.ip(),
      userAgent: faker.helpers.arrayElement(sampleUserAgents),
      createdAt,
    })
    .onConflictDoNothing();

  const sessionCount = faker.number.int({ min: 1, max: 8 });
  for (let i = 0; i < sessionCount; i++) {
    const userAgent = faker.helpers.arrayElement(sampleUserAgents);
    const parser = new UAParser(userAgent);
    const deviceType = parser.getDevice().type || 'desktop';
    const loginDate = faker.date.between({ from: createdAt, to: new Date() });

    await db
      .insert(userSessions)
      .values({
        jti: uuidv4(),
        userId: id,
        ipAddress: faker.internet.ip(),
        userAgent: userAgent,
        deviceType: deviceType,
        country: faker.location.country(),
        countryCode: faker.location.countryCode(),
        createdAt: loginDate,
      })
      .onConflictDoNothing();

    await db.insert(auditLogs).values({
      userId: id,
      action: 'LOGIN_SUCCESS',
      ipAddress: faker.internet.ip(),
      userAgent: userAgent,
      createdAt: loginDate,
    });
  }

  await publisher.publish({
    id,
    email,
    firstName,
    lastName,
    avatarUrl,
    role,
  });

  console.log(
    `Created ${role}: ${email} (ID: ${id}) on ${createdAt.toDateString()}`
  );
}

async function runSeed() {
  console.log('Starting rich DB seed for auth-service...');
  let totalStudents = 0;
  try {
    await rabbitMQConnection.connect();

    console.log('Clearing existing data (audit logs, sessions, users)...');
    await db.delete(auditLogs);
    await db.delete(userSessions);
    await db.delete(users);

    console.log('Creating admin user...');
    await createUserAndPublish(ADMIN_ID, 'admin', new Date(), {
      firstName: 'Admin',
      email: 'admin@admin.com',
    });

    console.log(
      `Creating ${hardcodedInstructorIds.length} hardcoded instructors...`
    );
    for (const instructorId of hardcodedInstructorIds) {
      await createUserAndPublish(
        instructorId,
        'instructor',
        faker.date.past({ years: 10 })
      );
    }

    console.log(`Generating ${DYNAMIC_USERS_TO_GENERATE} dynamic users...`);
    for (let i = 0; i < DYNAMIC_USERS_TO_GENERATE; i++) {
      const id = faker.string.uuid();
      const createdAt = faker.date.past({ years: 10 });
      await createUserAndPublish(id, 'student', createdAt);
      totalStudents++;
    }

    console.log('--- Seeding Summary ---');
    console.log(`Total Instructors Created: ${hardcodedInstructorIds.length}`);
    console.log(`Total Students Generated: ${totalStudents}`);
    console.log('Auth-service data seeded successfully.');
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  } finally {
    await rabbitMQConnection.close();
    process.exit(0);
  }
}

runSeed();
