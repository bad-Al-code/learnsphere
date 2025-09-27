import { Resend } from 'resend';

import { env } from '../config/env';
import logger from '../config/logger';
import { EmailOutboxRepository } from '../db/email-outbox.repository';
import { EmailOptions } from '../types';

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
      logger.error('Error sending email via Resend EmailClient: %o', {
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

  /**
   * Sends multiple emails in bulk using Resend batch API
   * and logs each message to the outbox.
   * @param messages Array of messages to send. Each message must include:
   *   - from: string
   *   - to: string
   *   - subject: string
   *   - html: string
   *   - text: string
   */
  public async sendBulk(
    messages: {
      from: string;
      to: string;
      subject: string;
      html: string;
      text: string;
      type?: string;
    }[]
  ): Promise<void> {
    if (!messages || messages.length === 0) return;

    const fromAddress = `${env.EMAIL_FROM_NAME} <${env.EMAIL_FROM_ADDRESS}>`;

    const batchMessages = messages.map((msg) => ({
      from: fromAddress,
      to: [msg.to],
      subject: msg.subject,
      html: msg.html,
      text: msg.text,
    }));

    let sendError: Error | null = null;

    try {
      const { data, error } = await this.resend.batch.send(batchMessages);

      if (error) throw error;

      logger.info(
        `Successfully sent batch of ${messages.length} emails via Resend.`
      );

      for (const msg of messages) {
        await EmailOutboxRepository.create({
          recipient: msg.to,
          subject: msg.subject,
          type: msg.type ?? 'user_notification',

          status: 'sent',
          errorMessage: null,
        });
      }
    } catch (error) {
      sendError = error as Error;

      logger.error('Error sending bulk emails via Resend EmailClient: %o', {
        error: sendError.message,
        stack: sendError.stack,
      });

      for (const msg of messages) {
        await EmailOutboxRepository.create({
          recipient: msg.to,
          subject: msg.subject,

          type: msg.type ?? 'user_notification',
          status: 'failed',
          errorMessage: sendError.message,
        });
      }

      throw sendError;
    }
  }
}
