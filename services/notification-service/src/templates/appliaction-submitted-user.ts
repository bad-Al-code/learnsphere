import { EmailLayout } from './EmailLayout';

export const generateApplicationSubmittedUserEmail = (
  userName: string
): string => {
  const content = `
    <p>Hi ${userName},</p>
    <p>Thank you for your application to become an instructor on LearnSphere! We have successfully received it.</p>
    <p>Our team will review your application and you will be notified of our decision via email. This process typically takes 3-5 business days.</p>
    <p>We appreciate your interest in sharing your knowledge with our community.</p>
    <p>Best regards,<br>The LearnSphere Team</p>
  `;

  return EmailLayout(content);
};
