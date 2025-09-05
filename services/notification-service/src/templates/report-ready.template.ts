import { EmailButton, EmailLayout } from './EmailLayout';

export const generateReportReadyEmail = (
  userName: string | null,
  reportType: string,
  downloadUrl: string
): string => {
  const content = `
    <p>Hi ${userName || 'there'},</p>
    <p>Good news! Your <strong>${reportType.replace('_', ' ')}</strong> report has been generated and is ready for download.</p>
    <p>You can access your file using the button below. Please note that for security, this link will expire in one hour.</p>
    <p style="text-align: center; margin: 30px 0;">
        ${EmailButton(downloadUrl, 'Download Your Report')}
    </p>
    <p>Best regards,<br>The LearnSphere Team</p>
  `;

  return EmailLayout(content);
};
