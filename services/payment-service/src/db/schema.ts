import {
  decimal,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'completed',
  'failed',
]);

export const userRoleEnum = pgEnum('user_role', [
  'student',
  'instructor',
  'admin',
]);

export type UserRole = (typeof userRoleEnum.enumValues)[number];
export type PaymentStatus = (typeof paymentStatusEnum.enumValues)[number];

/**
@table payments
@description Stores a record for every payment attempt initiated via Razorpay.
*/
export const payments = pgTable('payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  courseId: uuid('course_id').notNull(),
  coursePriceAtPayment: decimal('course_price_at_payment', {
    precision: 10,
    scale: 2,
  }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: text('currency').notNull().default('INR'),
  status: paymentStatusEnum('status').notNull().default('pending'),
  razorpayOrderId: text('razorpay_order_id').notNull().unique(),
  razorpayPaymentId: text('razorpay_payment_id').unique(),
  razorpaySignature: text('razorpay_signature'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

/**
@table courses
@description A local, simplified replica of course data needed for payments
This table is populated by listening to 'course.created' and 'course.updated' events
*/
export const courses = pgTable('courses', {
  id: uuid('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  instructorId: uuid('instructor_id').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).default('0.00'),
  currency: varchar('currency', { length: 3 }),
});

/**
@table users
@description A local, simplified replica of user data needed for payments.
This table is populated by listening to 'user.registered' and 'user.updated' events.
*/
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email').notNull().unique(),
  role: userRoleEnum('role').default('student').notNull(),
});
