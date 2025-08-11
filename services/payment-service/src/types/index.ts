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
  payload: RazorpayWebhookPayload;
}

export interface RazorpayPaymentEntity {
  id: string;
  order_id: string;
  amount: number;
  currency: string;
  status: 'captured' | 'failed' | 'created';
  error_code: string | null;
  error_description: string | null;
}

export interface RazorpayWebhookPayload {
  payment: {
    entity: RazorpayPaymentEntity;
  };
}
