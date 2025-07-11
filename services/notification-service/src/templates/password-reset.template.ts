import { EmailButton, EmailLayout } from "./EmailLayout";

/**
 * Generates the HTML for the password reset email.
 * @param resetLink - The unique link the user must click to reset their password.
 * @returns The full, styled HTML email string.
 */
export const generatePasswordResetEmail = (resetLink: string): string => {
  const content = `
    <p>Hello,</p>
    <p>We received a request to reset the password for your LearnSphere account. If you did not make this request, you can safely ignore this email.</p>
    <p>To reset your password, please click the button below:</p>
    <p style="text-align: center; margin: 30px 0;">
        ${EmailButton(resetLink, "Reset Your Password")}
    </p>
    <p>This password reset link will expire in 15 minutes.</p>
    <p>Best regards,<br>The LearnSphere Team</p>
  `;

  return EmailLayout(content);
};
