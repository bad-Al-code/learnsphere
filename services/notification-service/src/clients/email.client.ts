import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import logger from "../config/logger";

export interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export class EmailClient {
  private transporter: Mail;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587", 10),
      // secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
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
        from: `LearnSphere ${process.env.EMAIL_FROM}`,
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
