import nodemailer from "nodemailer";
import logger from "../config/logger";
import { EmailClient } from "../clients/email.client";

interface VerificationEmailData {
  email: string;
  verificationToken: string;
}

interface PasswordResetEmailData {
  email: string;
  resetToken: string;
}

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
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
    const verificationLink = `http://localhost:8000/verify-email?token=${data.verificationToken}&email=${data.email}`;

    const htmlBody = `
      <h1>Welcome to LearnSphere</h1>
      <p>Please click the link below to verify your email address.</p>
      <a href="${verificationLink}">Verify Email</a>
    `;

    await this.emailClient.send({
      to: data.email,
      subject: "Welcome to LearnSphere! Please Verify Your Email",
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
    const resetLink = `http://localhost:8000/reset-password?token=${data.resetToken}&email=${data.email}`;

    const htmlBody = `
      <h1>Password Reset Request</h1>
      <p>Click the link below to reset your password.</p>
      <a href="${resetLink}">Reset Password</a>
    `;

    await this.emailClient.send({
      to: data.email,
      subject: "LearnSphere Password Reset Request",
      text: `Reset your password with this link: ${resetLink}`,
      html: htmlBody,
    });
  }
}
