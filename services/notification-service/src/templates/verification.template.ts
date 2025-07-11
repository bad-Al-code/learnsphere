import { EmailButton, EmailLayout } from './EmailLayout';

/**
 * Generates the HTML for the email verification email.
 * @param verificationLink - The unique link the user must click to verify their account.
 * @returns The full, styled HTML email string.
 */
export const generateVerificationEmail = (verificationLink: string): string => {
  const content = `
    <p>Hello,</p>
    <p>Thank you for signing up for LearnSphere! To complete your registration, please verify your email address by clicking the button below.</p>
    <p style="text-align: center; margin: 30px 0;">
      ${EmailButton(verificationLink, 'Verify Email Address')}
    </p>
    <p>This verification link will expire in 2 hours.</p>
    <p>Welcome aboard,<br>The LearnSphere Team</p>
  `;

  return EmailLayout(content);
};
