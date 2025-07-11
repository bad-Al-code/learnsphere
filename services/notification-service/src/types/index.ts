import { notifications } from '../db/schema';

export interface VerificationEmailData {
  email: string;
  verificationToken: string;
}

export interface PasswordResetEmailData {
  email: string;
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
  // text: string;
  html: string;
}

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
