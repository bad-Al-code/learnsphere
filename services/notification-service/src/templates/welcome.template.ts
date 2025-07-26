import { EmailLayout, EmailButton } from './EmailLayout';

/**
 * Generates the HTML for the welcome email.
 * @param firstName - The user's first name, if available.
 * @param loginLink - A link to the application's login page.
 * @returns The full, styled HTML email string.
 */
export const generateWelcomeEmail = (
  firstName: string | null,
  loginLink: string
): string => {
  const content = `
    <p>Hi ${firstName || 'there'},</p>
    <p>Welcome to LearnSphere! We're thrilled to have you on board. Your account is now active and ready to go.</p>
    <p>You can start exploring courses and connecting with instructors right away.</p>
    <p style="text-align: center; margin: 30px 0;">
        ${EmailButton(loginLink, 'Go to Dashboard')}
    </p>
    <p>If you have any questions, feel free to contact our support team.</p>
    <p>Happy learning,<br>The LearnSphere Team</p>
  `;

  return EmailLayout(content);
};
