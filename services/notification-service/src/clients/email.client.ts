import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

import logger from '../config/logger';
import { env } from '../config/env';
import { EmailOptions } from '../types';

export class EmailClient {
  private transporter: Mail;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.EMAIL_HOST,
      port: env.EMAIL_PORT,
      // secure: true,
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
      },
    });

    logger.info(`Nodemailer transporter configured`);
  }

  /**
   * Sends an email
   * @param options  The email optioons (to, subject, text, html)
   */
  public async send(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: `LearnSphere ${env.EMAIL_FROM}`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      const info = await this.transporter.sendMail(mailOptions);

      logger.info(
        `Email sent successfully to ${options.to}. Message ID: ${info.messageId}`
      );
    } catch (error) {
      logger.error(`Error seding email via EmailClient`, {
        error: error instanceof Error ? error.message : String(error),
      });

      throw error;
    }
  }
}
