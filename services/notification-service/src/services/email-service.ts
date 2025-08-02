import { EmailClient } from '../clients/email.client';
import { generateApplicationSubmittedUserEmail } from '../templates/appliaction-submitted-user';
import { generateApplicationApprovedEmail } from '../templates/application-approved.template';
import { generateApplicationDeclinedEmail } from '../templates/application-declined.template';
import { generateApplicationSubmittedAdminEmail } from '../templates/application-submitted.template';
import { generatePasswordChangeNotice } from '../templates/password-change-notice.template';
import { generatePasswordResetEmail } from '../templates/password-reset.template';
import { generateVerificationEmail } from '../templates/verification.template';
import { generateWelcomeEmail } from '../templates/welcome.template';
import {
  PasswordChangeNoticeData,
  PasswordResetEmailData,
  VerificationEmailData,
  WelcomeEmailData,
} from '../types';

export class EmailService {
  private emailClient: EmailClient;

  constructor(emailClient: EmailClient) {
    this.emailClient = emailClient;
  }

  /**
   * Constructs and sends a verification email.
   * @param data The data needed to build the email.
   */
  public async sendVerificationEmail(
    data: VerificationEmailData
  ): Promise<void> {
    const verificationLink = `http://localhost:3000/verify-email?token=${data.verificationToken}&email=${data.email}`;

    const htmlBody = generateVerificationEmail(
      data.verificationCode,
      verificationLink
    );

    await this.emailClient.send({
      to: data.email,
      subject: 'Welcome to LearnSphere! Please Verify Your Email',
      text: `Please verify your email by visiting this link: ${verificationLink}`,
      html: htmlBody,
      type: 'verification',
    });
  }

  /**
   * Constructs and sends a password reset email.
   * @param data The data needed to build the email.
   */
  public async sendPasswordResetEmail(
    data: PasswordResetEmailData
  ): Promise<void> {
    const resetLink = `http://localhost:3000/reset-password?token=${data.resetToken}&email=${data.email}`;

    const htmlBody = generatePasswordResetEmail(data.resetCode, resetLink);

    await this.emailClient.send({
      to: data.email,
      subject: 'LearnSphere Password Reset Request',
      text: `Reset your password with this link: ${resetLink}`,
      html: htmlBody,
      type: 'password_reset',
    });
  }

  /**
   * Constructs and sends a welcome email to a new user.
   * @param data The data needed to build the email
   */
  public async sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
    const loginLink = 'http://localhost:3000/login';
    const htmlBody = generateWelcomeEmail(data.firstName || null, loginLink);

    await this.emailClient.send({
      to: data.email,
      subject: 'Welcome to LearnSphere!',
      text:
        'Welcome to LearnSphere! We are excited to have you. You can log in at: ' +
        loginLink,
      html: htmlBody,
      type: 'welcome',
    });
  }

  /**
   * Constructs and sends a security notice anout a password change
   * @param data The data needed to build the email
   */
  public async sendPasswordChangeNotice(
    data: PasswordChangeNoticeData
  ): Promise<void> {
    const htmlBody = generatePasswordChangeNotice(data.email);

    await this.emailClient.send({
      to: data.email,
      subject: 'Security Alert: Your LearnSphere Password Has Been Changed',
      text: `This is a notification that the password for your account (${data.email}) has been changed. If you did not make this change, please contact support immediately.`,
      html: htmlBody,
      type: 'password_changed',
    });
  }

  public async sendApplicationApprovedEmail(data: {
    email: string;
    userName: string;
  }) {
    const loginLink = 'http://localhost:3000/login';
    const htmlBody = generateApplicationApprovedEmail(data.userName, loginLink);

    await this.emailClient.send({
      to: data.email,
      subject: "Congratulations! You're a LearnSphere Instructor",
      html: htmlBody,
      type: 'instructor_approved',
      text: `You now have access to the instructor dashboard where you can start creating courses and sharing your knowledge. Go to dashboard ${loginLink}`,
    });
  }

  public async sendApplicationDeclinedEmail(data: {
    email: string;
    userName: string;
  }) {
    const htmlBody = generateApplicationDeclinedEmail(data.userName);

    await this.emailClient.send({
      to: data.email,
      subject: 'Update on your LearnSphere Instructor Application',
      html: htmlBody,
      type: 'instructor_rejected',
      text: "Thank you for your interest in becoming an instructor on LearnSphere. After careful review, we've determined that we are unable to approve your application at this time.",
    });
  }

  public async sendApplicationSubmittedAdminEmail(data: {
    adminEmail: string;
    userName: string;
    expertise: string;
    userId: string;
  }) {
    const userAdminLink = `http://localhost:3000/admin/users/${data.userId}`;

    const htmlBody = generateApplicationSubmittedAdminEmail(
      data.userName,
      data.expertise,
      userAdminLink
    );

    await this.emailClient.send({
      to: data.adminEmail,
      subject: `New Instructor Application: ${data.userName}`,
      html: htmlBody,
      text: `New Instructor application from ${data.userName}. View here: ${userAdminLink}`,
      type: 'admin_notification',
    });
  }

  public async sendApplicationSubmittedUserEmail(data: {
    email: string;
    userName: string;
  }) {
    const htmlBody = generateApplicationSubmittedUserEmail(data.userName);
    await this.emailClient.send({
      to: data.email,
      subject: "We've Received Your Instructor Application",
      html: htmlBody,
      text: 'Thank you for your application to become an instructor on LearnSphere! We have received it and our team will review it shortly.',
      type: 'user_notification',
    });
  }
}
