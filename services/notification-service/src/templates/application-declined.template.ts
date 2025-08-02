import { EmailLayout } from './EmailLayout';

export const generateApplicationDeclinedEmail = (userName: string): string => {
  const content = `
    <p>Hi ${userName},</p>
    <p>Thank you for your interest in becoming an instructor on LearnSphere. After careful review, we've determined that we are unable to approve your application at this time.</p>
    <p>We encourage you to continue building your skills and welcome you to reapply in the future.</p>
    <p>Best regards,<br>The LearnSphere Team</p>
  `;

  return EmailLayout(content);
};
