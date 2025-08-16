import { faker } from '@faker-js/faker';
import { sql } from 'drizzle-orm';
import { db } from '.';
import { rabbitMQConnection } from '../events/connection';
import { DiscussionPostCreatedListener, Listener } from '../events/listener';
import { EnrollmentStatus } from '../types';
import {
  courses,
  dailyActivity,
  enrollments,
  NewCourse,
  NewUser,
  UserRole,
  users,
} from './schema';

const receivedCourses: NewCourse[] = [];
const receivedUsers: NewUser[] = [];

interface CourseCreatedEvent {
  topic: 'course.created';
  data: {
    courseId: string;
    instructorId: string;
    title: string;
    price: string | null;
    currency: string | null;
  };
}
class TempCourseListener extends Listener<CourseCreatedEvent> {
  readonly topic = 'course.created' as const;
  queueGroupName = 'enrollment-seed-course-listener';
  onMessage(data: CourseCreatedEvent['data']) {
    receivedCourses.push({
      id: data.courseId,
      instructorId: data.instructorId,
      price: data.price,
      currency: data.currency,
    });
  }
}

interface UserRegisteredEvent {
  topic: 'user.registered';
  data: { id: string; email: string; role: UserRole };
}
class TempUserListener extends Listener<UserRegisteredEvent> {
  readonly topic = 'user.registered' as const;
  queueGroupName = 'enrollment-seed-user-listener';
  onMessage(data: UserRegisteredEvent['data']) {
    receivedUsers.push({ id: data.id, email: data.email, role: data.role });
  }
}

async function seedEnrollmentsAndActivity() {
  if (receivedUsers.length === 0 || receivedCourses.length === 0) {
    console.log('Not enough user or course data to create records.');
    return;
  }

  const enrollmentData = [];
  const instructorActivity = new Map<string, { discussions: number }>();

  for (const user of receivedUsers) {
    const availableCourses = receivedCourses;
    const coursesToEnrollIn = faker.helpers.arrayElements(
      availableCourses,
      faker.number.int({ min: 0, max: 25 })
    );

    for (const course of coursesToEnrollIn) {
      const totalLessons = faker.number.int({ min: 15, max: 100 });
      const completedLessonsCount = faker.number.int({
        min: 0,
        max: totalLessons,
      });
      const completedLessons = Array.from(
        { length: completedLessonsCount },
        () => faker.string.uuid()
      );
      const progressPercentage = (completedLessonsCount / totalLessons) * 100;
      const courseStructure = { totalLessons, modules: [] };

      const enrolledAt = faker.date.past({ years: 10 });
      const lastAccessedAt = faker.date.between({
        from: enrolledAt,
        to: new Date(),
      });

      enrollmentData.push({
        userId: user.id,
        courseId: course.id,
        coursePriceAtEnrollment: course.price ?? '0.00',
        status:
          progressPercentage === 100
            ? 'completed'
            : ('active' as EnrollmentStatus),
        courseStructure,
        progress: { completedLessons },
        progressPercentage: progressPercentage.toFixed(2),
        enrolledAt,
        lastAccessedAt,
      });

      const discussionCount = faker.number.int({ min: 0, max: 15 });
      if (discussionCount > 0) {
        for (let i = 0; i < discussionCount; i++) {
          const postCreatedAt = faker.date
            .between({ from: enrolledAt, to: new Date() })
            .toISOString()
            .split('T')[0];

          const key = `${course.instructorId}:${postCreatedAt}`;
          const currentActivity = instructorActivity.get(key) || {
            discussions: 0,
          };
          currentActivity.discussions += 1;
          instructorActivity.set(key, currentActivity);
        }
      }
    }
  }

  if (enrollmentData.length > 0) {
    const batchSize = 100;
    for (let i = 0; i < enrollmentData.length; i += batchSize) {
      const batch = enrollmentData.slice(i, i + batchSize);
      await db.insert(enrollments).values(batch).onConflictDoNothing();
    }
  }

  const dailyActivityData = [];
  for (const [key, activity] of instructorActivity.entries()) {
    const [instructorId, date] = key.split(':');
    dailyActivityData.push({
      instructorId,
      date,
      discussions: activity.discussions,
    });
  }

  if (dailyActivityData.length > 0) {
    console.log(
      `Inserting ${dailyActivityData.length} daily activity records...`
    );
    const batchSize = 100;
    for (let i = 0; i < dailyActivityData.length; i += batchSize) {
      const batch = dailyActivityData.slice(i, i + batchSize);

      await db
        .insert(dailyActivity)
        .values(batch)
        .onConflictDoUpdate({
          target: [dailyActivity.instructorId, dailyActivity.date],
          set: {
            discussions: sql`${dailyActivity.discussions} + excluded.discussions`,
          },
        });
    }
  }
}

async function runSeed() {
  try {
    console.log('Starting rich DB seed for enrollment-service...');
    await rabbitMQConnection.connect();

    console.log('Clearing existing enrollments data...');
    await db.delete(dailyActivity);
    await db.delete(enrollments);
    await db.delete(users);
    await db.delete(courses);

    console.log('Listening for user and course events for 10 minutes...');
    new TempUserListener().listen();
    new TempCourseListener().listen();
    new DiscussionPostCreatedListener().listen();

    await new Promise((resolve) => setTimeout(resolve, 600000));

    if (receivedUsers.length > 0)
      await db.insert(users).values(receivedUsers).onConflictDoNothing();
    if (receivedCourses.length > 0)
      await db.insert(courses).values(receivedCourses).onConflictDoNothing();

    await seedEnrollmentsAndActivity();

    console.log('Enrollment service data seeded successfully.');
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  } finally {
    await rabbitMQConnection.close();
    process.exit(0);
  }
}

runSeed();
