import { faker } from '@faker-js/faker';
import { db } from '.';
import { rabbitMQConnection } from '../events/connection';
import { Listener } from '../events/listener';
import { NewCourse, NewUser } from '../types';
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
    receivedUsers.push({
      id: data.id,
      email: data.email,
      role: data.role,
    });
  }
}

async function seedLocalTables() {
  if (receivedCourses.length > 0) {
    await db.insert(courses).values(receivedCourses).onConflictDoNothing();
  }
  if (receivedUsers.length > 0) {
    await db.insert(users).values(receivedUsers).onConflictDoNothing();
  }
}

async function seedPayments() {
  const paidCourses = receivedCourses.filter(
    (course) => course.price && parseFloat(course.price) > 0
  );

  if (receivedUsers.length === 0 || paidCourses.length === 0) {
    return;
  }

  const paymentData = [];
  for (const user of receivedUsers) {
    const availableCourses = paidCourses.filter(
      (c) => c.instructorId !== user.id
    );

    const coursesToBuy = faker.helpers.arrayElements(
      availableCourses,
      faker.number.int({ min: 0, max: 20 })
    );

    for (const course of coursesToBuy) {
      const status =
        Math.random() > 0.05 ? ('completed' as const) : ('failed' as const);

      paymentData.push({
        userId: user.id,
        courseId: course.id,
        coursePriceAtPayment: String(course.price),
        amount: String(course.price),
        currency: course.currency || 'INR',
        status,
        razorpayOrderId: `order_${faker.string.alphanumeric(14)}`,
        razorpayPaymentId:
          status === 'completed'
            ? `pay_${faker.string.alphanumeric(14)}`
            : null,
        razorpaySignature:
          status === 'completed'
            ? faker.string.hexadecimal({ length: 64 })
            : null,
        createdAt: faker.date.past({ years: 10 }),
      });
    }
  }

  if (paymentData.length > 0) {
    for (let i = 0; i < paymentData.length; i += 500) {
      const batch = paymentData.slice(i, i + 500);
      await db.insert(payments).values(batch).onConflictDoNothing();
    }
  }
}

async function runSeed() {
  try {
    await rabbitMQConnection.connect();

    console.log('Clearing existing payment data...');
    await db.delete(payments);
    await db.delete(users);
    await db.delete(courses);

    console.log('Listening for course and user events for 10 minutes...');
    new TempCourseListener().listen();
    new TempUserListener().listen();
    await new Promise((resolve) => setTimeout(resolve, 600000));

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
