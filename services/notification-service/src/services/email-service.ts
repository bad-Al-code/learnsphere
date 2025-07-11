import { EmailClient } from '../clients/email.client';
import { generateVerificationEmail } from '../templates/verification.template';
import { generatePasswordResetEmail } from '../templates/password-reset.template';
import { generateWelcomeEmail } from '../templates/welcome.template';
import { generatePasswordChangeNotice } from '../templates/password-change-notice.template';

interface VerificationEmailData {
  email: string;
  verificationToken: string;
}

interface PasswordResetEmailData {
  email: string;
  resetToken: string;
}

interface WelcomeEmailData {
  email: string;
  firstName?: string | null;
}

interface PasswordChangeNoticeData {
  email: string;
}

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

    const htmlBody = generateVerificationEmail(verificationLink);

    await this.emailClient.send({
      to: data.email,
      subject: 'Welcome to LearnSphere! Please Verify Your Email',
      text: `Please verify your email by visiting this link: ${verificationLink}`,
      html: htmlBody,
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

    const htmlBody = generatePasswordResetEmail(resetLink);

    await this.emailClient.send({
      to: data.email,
      subject: 'LearnSphere Password Reset Request',
      text: `Reset your password with this link: ${resetLink}`,
      html: htmlBody,
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
    });
  }
}
