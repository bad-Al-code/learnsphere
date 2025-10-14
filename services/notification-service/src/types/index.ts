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
  type:
    | 'verification'
    | 'password_reset'
    | 'welcome'
    | 'password_changed'
    | 'instructor_approved'
    | 'instructor_rejected'
    | 'admin_notification'
    | 'user_notification'
    | 'study_group_invite'
    | 'event_registration'
    | 'event_unregistration'
    | 'event_reminder'
    | 'reward_unlocked'
    | 'waitlist_confirmation'
    | 'nurture_week_1'
    | 'nurture_week_2';
}

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;

export type NewEmailLog = typeof emailOutbox.$inferInsert;

export interface RewardDetails {
  title: string;
  description: string;
}

export const rewardMap: Record<string, RewardDetails> = {
  '1_MONTH_FREE': {
    title: 'You Earned 1 Month of LearnSphere Pro!',
    description:
      'Thanks to your 3 successful referrals, you’ve unlocked a free month of full access to all our premium features at launch.',
  },
  LIFETIME_DISCOUNT_25: {
    title: 'You Earned a 25% Lifetime Discount!',
    description:
      'Incredible! With 5 successful referrals, you have secured a 25% discount on your LearnSphere subscription, forever.',
  },
  FOUNDING_MEMBER: {
    title: 'Congratulations, Founding Member!',
    description:
      "You are amazing! With 10 successful referrals, you've earned the exclusive status of a Founding Member, which comes with a free course and a special badge on your profile.",
  },
  default: {
    title: "You've Unlocked a New Reward!",
    description:
      'Congratulations on your successful referrals! You have unlocked a new reward. More details will be available at launch.',
  },
};
