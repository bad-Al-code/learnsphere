import { faker } from '@faker-js/faker';
import { UAParser } from 'ua-parser-js';
import { v4 as uuidv4 } from 'uuid';

import { db } from '..';
import { rabbitMQConnection } from '../../events/connection';
import { UserRegisteredPublisher } from '../../events/publisher';
import { Password } from '../../utils/password';
import { auditLogs, users, userSessions } from '../schema';
import { ADMIN_ID, hardcodedInstructorIds, studentIds } from './ids';

type UserRole = 'admin' | 'instructor' | 'student';
const sampleUserAgents = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Linux; Android 13; SM-S908B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (iPad; CPU OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/109.0.5414.87 Mobile/15E148 Safari/604.1',

  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0; en-IN',
  'Mozilla/5.0 (Linux; Android 12; Redmi Note 11 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Mobile Safari/537.36; hi-IN',
  'Mozilla/5.0 (Linux; Android 11; OnePlus Nord) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.128 Mobile Safari/537.36; en-IN',
  'Mozilla/5.0 (Linux; Android 13; Pixel 6a) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Mobile Safari/537.36; ta-IN',
  'Mozilla/5.0 (Linux; Android 10; Samsung Galaxy M31) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.5304.141 Mobile Safari/537.36; te-IN',
  'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36; en-IN',
  'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/109.0; en-IN',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 12_6_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15; en-IN',
  'Mozilla/5.0 (Linux; Android 9; vivo 1904) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Mobile Safari/537.36; mr-IN',
  'Mozilla/5.0 (Linux; Android 12; Realme GT Neo 2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Mobile Safari/537.36; gu-IN',
  'Mozilla/5.0 (Linux; Android 13; iQOO 9 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Mobile Safari/537.36; bn-IN',
  'Mozilla/5.0 (Linux; Android 12; Oppo Reno7 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Mobile Safari/537.36; kn-IN',
  'Mozilla/5.0 (Linux; Android 13; Motorola Edge 30) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Mobile Safari/537.36; ml-IN',
  'Mozilla/5.0 (Linux; Android 11; Poco X3 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Mobile Safari/537.36; pa-IN',
  'Mozilla/5.0 (Linux; Android 12; Infinix Note 12) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Mobile Safari/537.36; or-IN',
  'Mozilla/5.0 (Linux; Android 13; Nothing Phone (1)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Mobile Safari/537.36; en-IN',
  'Mozilla/5.0 (Linux; Android 10; Micromax IN Note 1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.5304.141 Mobile Safari/537.36; hi-IN',
  'Mozilla/5.0 (Linux; Android 12; Lava Agni 5G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Mobile Safari/537.36; en-IN',
  'Mozilla/5.0 (Linux; Android 13; Tecno Phantom X2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Mobile Safari/537.36; en-IN',
  'Mozilla/5.0 (Linux; Android 12; JioPhone Next) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Mobile Safari/537.36; hi-IN',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:108.0) Gecko/20100101 Firefox/108.0; en-IN',
];

const publisher = new UserRegisteredPublisher();

async function createUserAndPublish(
  id: string,
  role: UserRole,
  details?: { firstName?: string; email?: string }
) {
  const firstName = details?.firstName || faker.person.firstName();
  const lastName = faker.person.lastName();
  const email =
    details?.email ||
    faker.internet.email({ firstName, lastName }).toLowerCase();
  const passwordHash = await Password.toHash('password');
  const avatarUrl = faker.image.avatar();

  await db.insert(users).values({
    id,
    email,
    passwordHash,
    role,
    isVerified: true,
  });
  await db.insert(auditLogs).values({
    userId: id,
    action: 'SIGNUP_SUCCESS',
    ipAddress: faker.internet.ip(),
    userAgent: faker.helpers.arrayElement(sampleUserAgents),
    createdAt: faker.date.past({ years: 1 }),
  });

  const sessionCount = faker.number.int({ min: 1, max: 4 });
  for (let i = 0; i < sessionCount; i++) {
    const userAgent = faker.helpers.arrayElement(sampleUserAgents);
    const parser = new UAParser(userAgent);
    const deviceType = parser.getDevice().type || 'desktop';

    await db.insert(userSessions).values({
      jti: uuidv4(),
      userId: id,
      ipAddress: faker.internet.ip(),
      userAgent: userAgent,
      deviceType: deviceType,
      country: faker.location.country(),
      countryCode: faker.location.countryCode(),
      createdAt: faker.date.past({ years: 1 }),
    });

    await db.insert(auditLogs).values({
      userId: id,
      action: 'LOGIN_SUCCESS',
      ipAddress: faker.internet.ip(),
      userAgent: userAgent,
      createdAt: faker.date.recent({ days: 30 }),
    });
  }

  await publisher.publish({
    id,
    email,
    firstName,
    lastName,
    avatarUrl,
  });

  console.log(`Created ${role}: ${email} (ID: ${id})`);
}

async function runSeed() {
  console.log('Starting rich DB seed for auth-service...');
  try {
    await rabbitMQConnection.connect();

    console.log('Clearing existing data (audit logs, sessions, users)...');
    await db.delete(auditLogs);
    await db.delete(userSessions);
    await db.delete(users);
    console.log('Creating admin user...');
    await createUserAndPublish(ADMIN_ID, 'admin', {
      firstName: 'Admin',
      email: 'admin@admin.com',
    });

    console.log(
      `Creating ${hardcodedInstructorIds.length} instructor users...`
    );
    for (const instructorId of hardcodedInstructorIds) {
      await createUserAndPublish(instructorId, 'instructor');
    }

    console.log(`Creating ${studentIds.length} student users...`);
    for (const studentId of studentIds) {
      await createUserAndPublish(studentId, 'student');
    }

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
