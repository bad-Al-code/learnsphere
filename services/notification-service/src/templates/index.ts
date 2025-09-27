import { EmailButton, EmailLayout } from './EmailLayout';

export class EmailTemplate {
  public static generateGenericInviteEmail(
    subject: string,
    message: string,
    linkUrl: string,
    inviterName: string
  ): string {
    const content = `
<p>Hello,</p> <p>You have received an invitation from <b>${inviterName}</b> to join a study session on LearnSphere.</p> <hr style="border: none; border-top: 1px solid #eaeaea; margin: 26px 0;" /> <p><i>${message.replace(/\n/g, '<br>')}</i></p> <p style="text-align: center; margin: 30px 0;"> ${EmailButton(linkUrl, 'Join the Study Room')} </p> <p>We look forward to seeing you there!<br>The LearnSphere Team</p>
    `;

    return EmailLayout(content);
  }

  public static generateBulkInviteEmail(
    subject: string,
    message: string,
    linkUrl: string,
    inviterName: string
  ): string {
    const content = `<p>Hello,</p> <p>You have received an invitation from <b>${inviterName}</b> to join a study session on LearnSphere.</p> <hr style="border: none; border-top: 1px solid #eaeaea; margin: 26px 0;" /> <p><i>${message.replace(/\n/g, '<br>')}</i></p> <p style="text-align: center; margin: 30px 0;"> ${EmailButton(linkUrl, 'Join the Study Room')} </p> <p>We look forward to seeing you there!<br>The LearnSphere Team</p>`;

    return EmailLayout(content);
  }
}
