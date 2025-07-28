import { EmailButton, EmailLayout } from './EmailLayout';

/**
 * Generates the HTML for the password reset email with a 6-digit code.
 * @param resetCode - The 6-digit code.
 * @param resetLink - The unique fallback link.
 * @returns The full, styled HTML email string.
 */
export const generatePasswordResetEmail = (
  resetCode: string,
  resetLink: string
): string => {
  const content = `
    <p>Hello,</p>
    <p>We received a request to reset your password. Enter the code below to proceed.</p>
    <div style="text-align: center; margin: 30px 0; background-color: #f4f4f4; padding: 20px; border-radius: 8px;">
        <p style="font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 0;">${resetCode}</p>
    </div>
    <p>This code will expire in 10 minutes. If you did not request a password reset, please ignore this email.</p>
    <hr style="border: none; border-top: 1px solid #eaeaea; margin: 26px 0;" />
    <p style="font-size: 12px; color: #666666;">If you're having trouble with the code, you can also use the link below:</p>
    <p style="text-align: center; margin: 20px 0;">
        ${EmailButton(resetLink, 'Reset with Link Instead')}
    </p>
    <p>Best regards,<br>The LearnSphere Team</p>
  `;

  return EmailLayout(content);
};
