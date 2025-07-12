import { Resend } from 'resend';

import logger from '../config/logger';
import { env } from '../config/env';
import { EmailOptions } from '../types';
import { EmailOutboxRepository } from '../db/email-outbox.repository';

export class EmailClient {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(env.RESEND_API_KEY);

    logger.info(`Resend EmailClient configured`);
  }

  /**
   * Sends an email
   * @param options  The email optioons (to, subject, text, html)
   */
  public async send(options: EmailOptions): Promise<void> {
    const fromAddress = `${env.EMAIL_FROM_NAME} <${env.EMAIL_FROM_ADDRESS}>`;
    let sendError: Error | null = null;

    try {
      const { data, error } = await this.resend.emails.send({
        from: fromAddress,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      if (error) {
        throw error;
      }

      logger.info(
        `Email send successfully via Resend to ${options.to}. Message ID: ${data?.id}`
      );
    } catch (error) {
      sendError = error as Error;
      logger.error(`Error sending email via Resend EmailClient`, {
        error: sendError.message,
        name: sendError.name,
        stack: sendError.stack,
        recipient: options.to,
      });
    } finally {
      await EmailOutboxRepository.create({
        recipient: options.to,
        subject: options.subject,
        type: options.type,
        status: sendError ? 'failed' : 'sent',
        errorMessage: sendError ? sendError.message : null,
      });
    }

    if (sendError) {
      throw sendError;
    }
  }
}
