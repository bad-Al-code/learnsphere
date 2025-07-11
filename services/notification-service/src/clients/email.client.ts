import { Resend } from 'resend';

import logger from '../config/logger';
import { env } from '../config/env';
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
    try {
      const fromAddress = `${env.EMAIL_FROM_NAME} <${env.EMAIL_FROM_ADDRESS}>`;

      const { data, error } = await this.resend.emails.send({
        from: fromAddress,
        to: options.to,
        subject: options.text,
        html: options.html,
      });

      if (error) {
        throw error;
      }

      logger.info(
        `Email send successfully via Resend to ${options.to}. Message ID: ${data?.id}`
      );
    } catch (error) {
      logger.error(`Error sending email via Resend EmailClient`, {
        error:
          error instanceof Error
            ? {
                message: error.message,
                name: error.name,
                stack: error.stack,
              }
            : String(error),
        recipient: options.to,
      });

      throw error;
    }
  }
}
