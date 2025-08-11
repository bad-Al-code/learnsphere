import { courses, payments, UserRole, users } from '../db/schema';

export type NewCourse = typeof courses.$inferInsert;
export type UpdateCourse = Partial<Omit<NewCourse, 'id'>>;

export type NewUser = typeof users.$inferInsert;

export type NewPayment = typeof payments.$inferInsert;
export interface CreateOrderData {
  courseId: string;
}
export interface Requester {
  id: string;
  email: string;
  role: UserRole;
}
