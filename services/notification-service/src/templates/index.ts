import { format } from 'date-fns';
import { rewardMap } from '../types';
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

  public static generateEventRegistrationEmail(
    userName: string | null,
    eventTitle: string,
    eventDate: string,
    linkUrl: string
  ): string {
    const formattedDate = format(new Date(eventDate), 'PPPPp');
    const content = `
    <p>Hi ${userName || 'there'},</p>

    <p><b>Confirmation:</b> You are now registered for the event!</p>

    <p><b>Event:</b> ${eventTitle}</p>

    <p><b>Date & Time:</b> ${formattedDate}</p>

    <p>
      We're excited to see you there. You can view the event details by clicking the button below.
    </p>

    <p style="text-align: center; margin: 30px 0;">
      ${EmailButton(linkUrl, 'View Event Details')}
    </p>

    <p>The LearnSphere Team</p>
  `;

    return EmailLayout(content);
  }

  public static generateEventUnregisteredEmail(
    userName: string | null,
    eventTitle: string,
    linkUrl: string
  ): string {
    const content = `
      <p>Hi ${userName || 'there'},</p>

      <p>
        This email confirms that you have successfully unregistered from the event:
        "<b>${eventTitle}</b>".
      </p>

      <p>
        If this was a mistake or you change your mind, you can register again as long as space is available.
      </p>

      <p style="text-align: center; margin: 30px 0;">
        ${EmailButton(linkUrl, 'View Other Events')}
      </p>

      <p>The LearnSphere Team</p>
    `;

    return EmailLayout(content);
  }

  public static generateEventReminderEmail(
    userName: string | null,
    eventTitle: string,
    eventDate: string,
    linkUrl: string
  ): string {
    const formattedTime = format(new Date(eventDate), 'p');

    const content = `
      <p>Hi ${userName || 'there'},</p>

      <p>
        Just a friendly reminder that your study event, "<b>${eventTitle}</b>," is starting soon at approximately
        <b>${formattedTime}</b>!
      </p>

      <p>Get ready to collaborate and learn with your peers.</p>

      <p style="text-align: center; margin: 30px 0;">
        ${EmailButton(linkUrl, 'Join Event Now')}
      </p>

      <p>
        See you there,<br>
        The LearnSphere Team
      </p>
  `;

    return EmailLayout(content);
  }

  public static generateWaitlistConfirmationEmail(): string {
    const content = `
    <p>Hello,</p>
    <p>Thank you for joining the waitlist for LearnSphere! We're thrilled to have you on board.</p>
    <p>You are now on the list to be among the first to know when we launch. We are working hard to build an incredible AI-powered learning experience and can't wait to share it with you.</p>
    <p>We'll be in touch with updates and an official launch announcement.</p>
    <p>Best regards,<br>The LearnSphere Team</p>
  `;

    return EmailLayout(content);
  }

  /**
   * Generates the HTML for the reward unlocked email.
   * @param userName The name of the user.
   * @param rewardId The identifier of the reward unlocked.
   * @returns The full, styled HTML email string.
   */
  public static generateRewardUnlockedEmail = (
    userName: string | null,
    rewardId: string
  ): string => {
    const reward = rewardMap[rewardId] || rewardMap.default;
    const dashboardLink = 'http://localhost:3000/waitlist';

    const content = `
    <p>Hi ${userName || 'there'},</p>
    <p><b>${reward.title}</b></p>
    <p>${reward.description}</p>
    <p>Thank you for helping us grow the LearnSphere community. Keep sharing to unlock even more rewards!</p>
    <p style="text-align: center; margin: 30px 0;">
        ${EmailButton(dashboardLink, 'Check Your Status')}
    </p>
    <p>Best regards,<br>The LearnSphere Team</p>
  `;

    return EmailLayout(content);
  };
}
