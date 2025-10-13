import { EmailClient } from '../clients/email.client';
import { env } from '../config/env';
import logger from '../config/logger';
import { EmailTemplate } from '../templates';
import { generateApplicationSubmittedUserEmail } from '../templates/appliaction-submitted-user';
import { generateApplicationApprovedEmail } from '../templates/application-approved.template';
import { generateApplicationDeclinedEmail } from '../templates/application-declined.template';
import { generateApplicationSubmittedAdminEmail } from '../templates/application-submitted.template';
import { generateFeedbackReadyEmail } from '../templates/feedback-ready.template';
import { generatePasswordChangeNotice } from '../templates/password-change-notice.template';
import { generatePasswordResetEmail } from '../templates/password-reset.template';
import { generateReportFailedEmail } from '../templates/report-failed.template';
import { generateReportReadyEmail } from '../templates/report-ready.template';
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

  public async sendReportReadyEmail(data: {
    email: string;
    userName: string | null;
    reportType: string;
    downloadUrl: string;
  }): Promise<void> {
    const htmlBody = generateReportReadyEmail(
      data.userName,
      data.reportType,
      data.downloadUrl
    );

    await this.emailClient.send({
      to: data.email,
      subject: `Your LearnSphere Report is Ready!`,
      html: htmlBody,
      text: `Your "${data.reportType}" report is ready. Download it here: ${data.downloadUrl}`,
      type: 'user_notification',
    });
  }

  public async sendReportFailedEmail(data: {
    email: string;
    userName: string | null;
    reportType: string;
    reason: string;
  }): Promise<void> {
    const htmlBody = generateReportFailedEmail(
      data.userName,
      data.reportType,
      data.reason
    );

    await this.emailClient.send({
      to: data.email,
      subject: `There was an issue with your LearnSphere Report`,
      html: htmlBody,
      text: `We're sorry, there was an issue generating your "${data.reportType}" report. Reason: ${data.reason}`,
      type: 'user_notification',
    });
  }

  public async sendFeedbackReadyEmail(data: {
    email: string;
    userName: string | null;
    assignmentTitle: string;
    linkUrl: string;
  }): Promise<void> {
    const htmlBody = generateFeedbackReadyEmail(
      data.userName,
      data.assignmentTitle,
      data.linkUrl
    );

    await this.emailClient.send({
      to: data.email,
      subject: `Your AI Feedback for "${data.assignmentTitle}" is Ready!`,
      html: htmlBody,
      text: `Your AI feedback is ready. View it here: ${data.linkUrl}`,
      type: 'user_notification',
    });
  }

  public async sendBatchInvites(
    emails: string[],
    subject: string,
    message: string,
    linkUrl: string,
    inviterName: string
  ) {
    const htmlBody = EmailTemplate.generateGenericInviteEmail(
      subject,
      message,
      linkUrl,
      inviterName
    );

    const sendPromises = emails.map((email) => {
      return this.emailClient.send({
        to: email,
        subject: subject,
        html: htmlBody,
        text: `${message}\n\nJoin here: ${linkUrl}`,
        type: 'study_group_invite',
      });
    });

    await Promise.all(sendPromises);

    logger.info(`Successfully sent ${emails.length} study room invitations.`);
  }

  public async sendBulkInvites(
    contacts: { name: string; email: string }[],
    subject: string,
    message: string,
    linkUrl: string,
    inviterName: string
  ) {
    if (contacts.length === 0) return;

    const htmlBody = EmailTemplate.generateBulkInviteEmail(
      subject,
      message,
      linkUrl,
      inviterName
    );
    const fromAddress = `${env.EMAIL_FROM_NAME} <${env.EMAIL_FROM_ADDRESS}>`;

    const messages = contacts.map((contact) => ({
      from: fromAddress,
      to: contact.email,
      subject: subject,
      html: htmlBody,
      text: `${message}\n\nJoin here: ${linkUrl}`,
    }));

    try {
      await this.emailClient.sendBulk(messages);
      logger.info(
        `Successfully queued ${contacts.length} bulk study room invitations.`
      );
    } catch (error) {
      logger.error('Failed to send bulk invites', { error });
      throw error;
    }
  }

  /**
   * Sends a confirmation email to a user after they register for an event.
   * @param data - The information required to send the registration confirmation email.
   * @param data.email - The recipient's email address.
   * @param data.userName - The recipient's name, if available.
   * @param data.eventTitle - The title of the event.
   * @param data.eventDate - The date of the event as a string.
   * @param data.linkUrl - The URL for the user to view event details.
   */
  public async sendEventRegistrationConfirmation(data: {
    email: string;
    userName: string | null;
    eventTitle: string;
    eventDate: string;
    linkUrl: string;
  }): Promise<void> {
    const htmlBody = EmailTemplate.generateEventRegistrationEmail(
      data.userName,
      data.eventTitle,
      data.eventDate,
      data.linkUrl
    );
    await this.emailClient.send({
      to: data.email,
      subject: `You're Registered for: ${data.eventTitle}`,
      html: htmlBody,
      text: `You are confirmed for ${data.eventTitle} on ${new Date(data.eventDate).toLocaleString()}.`,
      type: 'event_registration',
    });
  }

  /**
   * Sends a notification email to a user confirming they have unregistered from an event.
   * @param data - The information required to send the unregistration email.
   * @param data.email - The recipient's email address.
   * @param data.userName - The recipient's name, if available.
   * @param data.eventTitle - The title of the event the user unregistered from.
   */
  public async sendEventUnregisteredNotice(data: {
    email: string;
    userName: string | null;
    eventTitle: string;
  }): Promise<void> {
    const linkUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/student/community?tab=events`;

    const htmlBody = EmailTemplate.generateEventUnregisteredEmail(
      data.userName,
      data.eventTitle,
      linkUrl
    );
    await this.emailClient.send({
      to: data.email,
      subject: `You have unregistered from: ${data.eventTitle}`,
      html: htmlBody,
      text: `This confirms you have unregistered from the event: ${data.eventTitle}.`,
      type: 'event_unregistration',
    });
  }

  /**
   * Sends a reminder email to a user about an upcoming event.
   * @param data - The information required to send the event reminder email.
   * @param data.email - The recipient's email address.
   * @param data.userName - The recipient's name, if available.
   * @param data.eventTitle - The title of the event.
   * @param data.eventDate - The date of the event as a string.
   * @param data.linkUrl - The URL for the user to join or view the event.
   */
  public async sendEventReminder(data: {
    email: string;
    userName: string | null;
    eventTitle: string;
    eventDate: string;
    linkUrl: string;
  }): Promise<void> {
    const htmlBody = EmailTemplate.generateEventReminderEmail(
      data.userName,
      data.eventTitle,
      data.eventDate,
      data.linkUrl
    );
    await this.emailClient.send({
      to: data.email,
      subject: `Reminder: "${data.eventTitle}" is starting soon!`,
      html: htmlBody,
      text: `Reminder: ${data.eventTitle} is starting soon. Join here: ${data.linkUrl}`,
      type: 'event_reminder',
    });
  }

  public async sendWaitlistConfirmationEmail(data: {
    email: string;
  }): Promise<void> {
    const htmlBody = EmailTemplate.generateWaitlistConfirmationEmail();

    await this.emailClient.send({
      to: data.email,
      subject: "You're on the LearnSphere Waitlist!",
      text: "You're on the list! We'll notify you as soon as LearnSphere is ready for launch. Thank you for your interest.",
      html: htmlBody,
      type: 'waitlist_confirmation',
    });
  }

  /**
   * Constructs and sends a reward unlocked notification email.
   * @param data The data needed to build the email.
   */
  public async sendRewardUnlockedEmail(data: {
    email: string;
    userName: string | null;
    rewardId: string;
  }): Promise<void> {
    const htmlBody = EmailTemplate.generateRewardUnlockedEmail(
      data.userName,
      data.rewardId
    );

    await this.emailClient.send({
      to: data.email,
      subject: "🎉 You've Unlocked a New Reward on LearnSphere!",
      text: `Congratulations! You've unlocked a new reward. Check your status on the waitlist page.`,
      html: htmlBody,
      type: 'reward_unlocked',
    });
  }
}
