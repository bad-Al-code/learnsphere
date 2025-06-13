import nodemailer from "nodemailer";
import logger from "../config/logger";

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || "587", 10),
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    logger.info(`Nodemailer transporter configured`);
  }

  public async sendMail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
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
      const err = error as Error;
      logger.error(`Error sending email: %o`, {
        errorMessage: err.message,
        errorName: err.name,
        errorStack: err.stack,
      });
    }
  }
}

export const emailService = new EmailService();
