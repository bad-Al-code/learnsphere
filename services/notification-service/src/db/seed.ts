import { faker } from '@faker-js/faker';
import { db } from '.';
import { rabbitMQConnection } from '../events/connection';
import { Listener } from '../events/listener';
import { emailOutbox, NewUser, notifications, UserRole, users } from './schema';

const receivedUsers: NewUser[] = [];
const receivedEnrollments: { userId: string; courseId: string }[] = [];

interface UserRegisteredEvent {
  topic: 'user.registered';
  data: { id: string; email: string; role: UserRole };
}
class TempUserListener extends Listener<UserRegisteredEvent> {
  readonly topic = 'user.registered' as const;
  queueGroupName = 'notification-seed-user-listener';
  onMessage(data: UserRegisteredEvent['data']) {
    console.log(`Seed listener received user: ${data.email}`);
    receivedUsers.push(data);
  }
}

interface UserEnrolledEvent {
  topic: 'user.enrolled';
  data: { userId: string; courseId: string };
}

class TempEnrollmentListener extends Listener<UserEnrolledEvent> {
  readonly topic = 'user.enrolled' as const;
  queueGroupName = 'notification-seed-enrollment-listener';
  onMessage(data: UserEnrolledEvent['data']) {
    console.log(`Seed listener received enrollment for user: ${data.userId}`);
    receivedEnrollments.push(data);
  }
}

async function seedNotifications() {
  console.log('Seeding notifications and email logs...');
  const notifData = [];
  const emailLogData = [];

  for (const user of receivedUsers) {
    notifData.push({
      recipientId: user.id,
      type: 'WELCOME',
      content: 'Welcome to LearnSphere! Your journey to knowledge begins now.',
      linkUrl: '/dashboard',
      createdAt: faker.date.past({ years: 10 }),
    });
    emailLogData.push({
      recipient: user.email,
      subject: 'Welcome to LearnSphere!',
      type: 'welcome',
      status: 'sent' as const,
      sentAt: faker.date.past({ years: 10 }),
    });
  }

  for (const enrollment of receivedEnrollments) {
    notifData.push({
      recipientId: enrollment.userId,
      type: 'ENROLLMENT_CONFIRMATION',
      content: `Your enrollment is confirmed! Start learning today.`,
      linkUrl: `/learn/${enrollment.courseId}`,
      createdAt: faker.date.past({ years: 10 }),
    });
  }

  if (notifData.length > 0) {
    console.log(`Inserting ${notifData.length} notification records...`);
    for (let i = 0; i < notifData.length; i += 500) {
      const batch = notifData.slice(i, i + 500);
      await db.insert(notifications).values(batch).onConflictDoNothing();
    }
    console.log(`Seeded ${notifData.length} notification records.`);
  }
  if (emailLogData.length > 0) {
    console.log(`Inserting ${emailLogData.length} email outbox records...`);
    for (let i = 0; i < emailLogData.length; i += 500) {
      const batch = emailLogData.slice(i, i + 500);
      await db.insert(emailOutbox).values(batch).onConflictDoNothing();
    }
    console.log(`Seeded ${emailLogData.length} email outbox records.`);
  }
}

async function runSeed() {
  try {
    console.log('Starting rich DB seed for notification-service...');
    await rabbitMQConnection.connect();

    console.log('Clearing existing data...');
    await db.delete(notifications);
    await db.delete(emailOutbox);
    await db.delete(users);

    console.log('Listening for user and enrollment events for 20 minutes...');
    new TempUserListener().listen();
    new TempEnrollmentListener().listen();
    await new Promise((resolve) => setTimeout(resolve, 1200000));

    if (receivedUsers.length > 0) {
      await db.insert(users).values(receivedUsers).onConflictDoNothing();
      console.log(`Synced ${receivedUsers.length} users locally.`);
    }
    await seedNotifications();

    console.log('Notification service data seeded successfully.');
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  } finally {
    await rabbitMQConnection.close();
    process.exit(0);
  }
}

runSeed();
