import { courses, payments, UserRole, users } from '../db/schema';

export type NewCourse = typeof courses.$inferInsert;
export type UpdateCourse = Partial<Omit<NewCourse, 'id'>>;

export type NewUser = typeof users.$inferInsert;

export interface CreateOrderData {
  courseId: string;
}
export interface Requester {
  id: string;
  email: string;
  role: UserRole;
}

export type Payment = typeof payments.$inferSelect;
export type NewPayment = typeof payments.$inferInsert;
export type UpdatePayment = Partial<Omit<NewPayment, 'id' | 'createdAt'>>;

export interface WebhookEvent {
  event: string;
  payload: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}
