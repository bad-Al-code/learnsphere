import { EmailButton, EmailLayout } from './EmailLayout';

export const generateApplicationApprovedEmail = (
  userName: string,
  loginLink: string
): string => {
  const content = `
    <p>Hi ${userName},</p>
    <p><b>Congratulations!</b> We're thrilled to inform you that your instructor application for LearnSphere has been approved.</p>
    <p>You now have access to the instructor dashboard where you can start creating courses and sharing your knowledge.</p>
    <p style="text-align: center; margin: 30px 0;">
        ${EmailButton(loginLink, 'Go to your Dashboard')}
    </p>
    <p>Welcome aboard,<br>The LearnSphere Team</p>
  `;

  return EmailLayout(content);
};
