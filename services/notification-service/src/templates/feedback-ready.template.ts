import { EmailButton, EmailLayout } from './EmailLayout';

export const generateFeedbackReadyEmail = (
  userName: string | null,
  assignmentTitle: string,
  link: string
): string => {
  const content = `
    <p>Hi ${userName || 'Student'},</p>
    <p>Great news! Your AI-powered feedback for the assignment "<b>${assignmentTitle}</b>" is now ready to view.</p>
    <p>Our AI assistant has reviewed your submission and provided detailed suggestions to help you improve.</p>
    <p style="text-align: center; margin: 30px 0;">
        ${EmailButton(link, 'View My Feedback')}
    </p>
    <p>Keep up the great work!<br>The LearnSphere Team</p>
  `;

  return EmailLayout(content);
};
