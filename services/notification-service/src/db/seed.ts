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
    receivedEnrollments.push(data);
  }
}

async function seedNotifications() {
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
    for (let i = 0; i < notifData.length; i += 100) {
      const batch = notifData.slice(i, i + 100);
      await db.insert(notifications).values(batch).onConflictDoNothing();
    }
  }
  if (emailLogData.length > 0) {
    for (let i = 0; i < emailLogData.length; i += 100) {
      const batch = emailLogData.slice(i, i + 100);
      await db.insert(emailOutbox).values(batch).onConflictDoNothing();
    }
  }
}

async function runSeed() {
  try {
    await rabbitMQConnection.connect();

    console.log('Clearing existing notifications data...');
    await db.delete(notifications);
    await db.delete(emailOutbox);
    await db.delete(users);

    console.log('Listening for user and enrollment events for 15 minutes...');
    new TempUserListener().listen();
    new TempEnrollmentListener().listen();
    await new Promise((resolve) => setTimeout(resolve, 900000));

    if (receivedUsers.length > 0) {
      await db.insert(users).values(receivedUsers).onConflictDoNothing();
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
