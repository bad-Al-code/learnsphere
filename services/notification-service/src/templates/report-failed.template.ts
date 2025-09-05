import { EmailButton, EmailLayout } from './EmailLayout';

export const generateReportFailedEmail = (
  userName: string | null,
  reportType: string,
  reason: string
): string => {
  const content = `
    <p>Hi ${userName || 'there'},</p>
    <p>We're sorry, but there was an issue generating your <strong>${reportType.replace('_', ' ')}</strong> report.</p>
    <p><strong>Reason:</strong> ${reason}</p>
    <p>Our team has been notified. Please feel free to try again later or contact support if the issue persists.</p>
    <p style="text-align: center; margin: 30px 0;">
        ${EmailButton('http://localhost:3000/dashboard/analytics?tab=reports', 'Go to Reports')}
    </p>
    <p>Best regards,<br>The LearnSphere Team</p>
  `;

  return EmailLayout(content);
};
