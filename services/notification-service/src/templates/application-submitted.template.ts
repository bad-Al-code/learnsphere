import { EmailButton, EmailLayout } from './EmailLayout';

export const generateApplicationSubmittedAdminEmail = (
  userName: string,
  expertise: string,
  userAdminLink: string
): string => {
  const content = `
    <p>Hello Admin,</p>
    <p>A new instructor application has been submitted by <b>${userName}</b>.</p>
    <p><b>Area of Expertise:</b> ${expertise}</p>
    <p>Please review their application in the admin panel.</p>
    <p style="text-align: center; margin: 30px 0;">
        ${EmailButton(userAdminLink, 'View Application')}
    </p>
    <p>Regards,<br>The LearnSphere System</p>
  `;

  return EmailLayout(content);
};
