import { EmailLayout } from './EmailLayout';

/**
 * Generates the HTML for the password change security alert.
 * @param email - The email of the user whose password was changed.
 * @returns The full, styled HTML email string.
 */
export const generatePasswordChangeNotice = (email: string): string => {
  const content = `
    <p>Hello,</p>
    <p>This is a security notification to inform you that the password for your LearnSphere account associated with this email address (${email}) was recently changed.</p>
    <p><b>If you made this change,</b> you can safely disregard this email.</p>
    <p><b>If you did not make this change,</b> please secure your account immediately by resetting your password and contacting our support team.</p>
    <p>Thank you for helping us keep your account secure.</p>
    <p>Best regards,<br>The LearnSphere Team</p>
  `;

  return EmailLayout(content);
};
