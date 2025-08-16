import { faker } from '@faker-js/faker';
import { db } from '.';
import { rabbitMQConnection } from '../events/connection';
import { Listener } from '../events/listener';
import { UserEnrollmentPublisher } from '../events/publisher';
import { EnrollmentStatus } from '../types';
import {
  courses,
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
    console.log(`Seed listener received course: ${data.title}`);
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
    console.log(`Seed listener received user: ${data.email}`);
    receivedUsers.push({ id: data.id, email: data.email, role: data.role });
  }
}

async function seedEnrollments() {
  if (receivedUsers.length === 0 || receivedCourses.length === 0) {
    console.log('Not enough user or course data to create enrollments.');
    return;
  }
  console.log(`Creating enrollments for ${receivedUsers.length} users...`);

  const publisher = new UserEnrollmentPublisher();

  const enrollmentData = [];
  const enrollmentEvents = [];

  for (const user of receivedUsers) {
    const availableCourses = receivedCourses.filter(
      (c) => c.instructorId !== user.id
    );

    const coursesToEnrollIn = faker.helpers.arrayElements(
      availableCourses,
      faker.number.int({ min: 0, max: 50 })
    );

    for (const course of coursesToEnrollIn) {
      const totalLessons = faker.number.int({ min: 20, max: 100 });
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

      const enrollmentId = faker.string.uuid();
      const enrolledAt = faker.date.past({ years: 10 });
      const lastAccessedAt = faker.date.between({
        from: enrolledAt,
        to: new Date(),
      });

      enrollmentData.push({
        id: enrollmentId,
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

      enrollmentEvents.push({
        enrollmentId,
        userId: user.id,
        courseId: course.id,
        enrolledAt,
      });
    }
  }

  if (enrollmentData.length > 0) {
    console.log(`Inserting ${enrollmentData.length} enrollment records...`);
    for (let i = 0; i < enrollmentData.length; i += 500) {
      const batch = enrollmentData.slice(i, i + 500);
      await db.insert(enrollments).values(batch).onConflictDoNothing();
      console.log(`Batch ${i / 500 + 1} inserted.`);
    }
    console.log(`Seeded ${enrollmentData.length} enrollment records.`);
  }

  console.log(`Publishing ${enrollmentEvents.length} user.enrolled events...`);
  for (const event of enrollmentEvents) {
    await publisher.publish({
      courseId: event.courseId,
      enrolledAt: event.enrolledAt,
      enrollmentId: event.enrollmentId,
      userId: event.userId,
    });
  }
  console.log('All enrollment events published.');
}

async function runSeed() {
  try {
    console.log('Starting rich DB seed for enrollment-service...');
    await rabbitMQConnection.connect();

    console.log('Clearing existing data...');
    await db.delete(enrollments);
    await db.delete(users);
    await db.delete(courses);

    console.log('Listening for user and course events for 20 minutes...');
    new TempUserListener().listen();
    new TempCourseListener().listen();
    await new Promise((resolve) => setTimeout(resolve, 1200000));

    if (receivedUsers.length > 0)
      await db.insert(users).values(receivedUsers).onConflictDoNothing();
    if (receivedCourses.length > 0)
      await db.insert(courses).values(receivedCourses).onConflictDoNothing();
    console.log(
      `Synced ${receivedUsers.length} users and ${receivedCourses.length} courses locally.`
    );

    await seedEnrollments();

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
