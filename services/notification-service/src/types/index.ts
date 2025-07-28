import { emailOutbox, notifications } from '../db/schema';

export interface UserPayload {
  id: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
}

export interface VerificationEmailData {
  email: string;
  verificationCode: string;
  verificationToken: string;
}

export interface PasswordResetEmailData {
  email: string;
  resetCode: string;
  resetToken: string;
}

export interface WelcomeEmailData {
  email: string;
  firstName?: string | null;
}

export interface PasswordChangeNoticeData {
  email: string;
}

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
  type: 'verification' | 'password_reset' | 'welcome' | 'password_changed';
}

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;

export type NewEmailLog = typeof emailOutbox.$inferInsert;
