import { faker } from '@faker-js/faker';
import { db } from '.';
import { rabbitMQConnection } from '../events/connection';
import { Listener } from '../events/listener';
import { NewCourse, NewUser } from '../types';
import { hardcodedInstructorIds } from './ids';
import { courses, payments, UserRole, users } from './schema';

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
  queueGroupName = 'payment-seed-course-listener';
  onMessage(data: CourseCreatedEvent['data']) {
    console.log(`Seed listener received course: ${data.title}`);
    receivedCourses.push({
      id: data.courseId,
      instructorId: data.instructorId,
      title: data.title,
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
  queueGroupName = 'payment-seed-user-listener';
  onMessage(data: UserRegisteredEvent['data']) {
    console.log(`Seed listener received user: ${data.email}`);
    receivedUsers.push({
      id: data.id,
      email: data.email,
      role: hardcodedInstructorIds.includes(data.id) ? 'instructor' : 'student',
    });
  }
}

async function seedLocalTables() {
  console.log('Syncing received data to local tables...');
  if (receivedCourses.length > 0) {
    await db.insert(courses).values(receivedCourses).onConflictDoNothing();
    console.log(`Synced ${receivedCourses.length} courses locally.`);
  }
  if (receivedUsers.length > 0) {
    await db.insert(users).values(receivedUsers).onConflictDoNothing();
    console.log(`Synced ${receivedUsers.length} users locally.`);
  }
}

async function seedPayments() {
  const studentUsers = receivedUsers.filter((user) => user.role === 'student');
  const paidCourses = receivedCourses.filter(
    (course) => course.price && parseFloat(course.price) > 0
  );

  if (studentUsers.length === 0 || paidCourses.length === 0) {
    console.log('Not enough student or paid course data to create payments.');
    return;
  }

  console.log(
    `Creating payment records for ${studentUsers.length} students...`
  );

  const paymentData = [];
  for (const student of studentUsers) {
    const coursesToBuy = faker.helpers.arrayElements(
      paidCourses,
      faker.number.int({ min: 5, max: 10 })
    );

    for (const course of coursesToBuy) {
      paymentData.push({
        userId: student.id,
        courseId: course.id,
        coursePriceAtPayment: String(course.price),
        amount: String(course.price),
        currency: course.currency || 'INR',
        status: 'completed' as const,
        razorpayOrderId: `order_${faker.string.alphanumeric(14)}`,
        razorpayPaymentId: `pay_${faker.string.alphanumeric(14)}`,
        razorpaySignature: faker.string.hexadecimal({ length: 64 }),
        createdAt: faker.date.past({ years: 1 }),
      });
    }
  }

  if (paymentData.length > 0) {
    await db.insert(payments).values(paymentData).onConflictDoNothing();
    console.log(`Seeded ${paymentData.length} payment records.`);
  }
}

async function runSeed() {
  try {
    console.log('Starting rich DB seed for payment-service...');
    await rabbitMQConnection.connect();

    console.log('Clearing existing payment data...');
    await db.delete(payments);
    await db.delete(users);
    await db.delete(courses);

    console.log('Listening for course and user events for 5 minutes...');
    new TempCourseListener().listen();
    new TempUserListener().listen();
    await new Promise((resolve) => setTimeout(resolve, 300000));

    await seedLocalTables();

    await seedPayments();

    console.log('Payment service data seeded successfully.');
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  } finally {
    await rabbitMQConnection.close();
    process.exit(0);
  }
}

runSeed();
