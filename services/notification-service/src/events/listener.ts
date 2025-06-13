import { ConsumeMessage } from "amqplib";
import logger from "../config/logger";
import { rabbitMQConnection } from "./connection";
import { emailService } from "../services/email-service";

interface Event {
  topic: string;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract topic: T["topic"];
  abstract queueGroupName: string;
  abstract onMessage(data: T["data"], msg: ConsumeMessage): void;

  protected exchange = "learnsphere";
  protected exchangeType = "topic";

  listen(): void {
    const channel = rabbitMQConnection.getChannel();

    const setup = async () => {
      await channel.assertExchange(this.exchange, this.exchangeType, {
        durable: true,
      });
      const q = await channel.assertQueue(this.queueGroupName, {
        durable: true,
      });
      await channel.bindQueue(q.queue, this.exchange, this.topic);

      logger.info(
        `Waiting for messages in queue [${this.queueGroupName}] on topic [${this.topic}]`
      );

      channel.consume(q.queue, (msg: ConsumeMessage | null) => {
        if (msg) {
          if (msg.fields.routingKey === this.topic) {
            logger.debug(`Message received from topic [${this.topic}]`);
            const parsedData = JSON.parse(msg.content.toString());
            this.onMessage(parsedData, msg);
          } else {
            logger.debug(
              `Message with topic [${msg.fields.routingKey}] ignored by listener for [${this.topic}]`
            );
          }
          channel.ack(msg);
        }
      });
    };

    setup().catch((error) => {
      logger.error(`Error setting up listener`, {
        queue: this.queueGroupName,
        topic: this.topic,
        error,
      });
    });
  }
}

interface UserVerificationRequiredEvent {
  topic: "user.verification.required";
  data: {
    email: string;
    verificationToken: string;
  };
}

export class UserVerificationRequiredListener extends Listener<UserVerificationRequiredEvent> {
  topic: "user.verification.required" = "user.verification.required";
  queueGroupName = "notification-service-verification";

  async onMessage(
    data: { email: string; verificationToken: string },
    msg: ConsumeMessage
  ): Promise<void> {
    logger.info(`Verification event received for: ${data.email}`);

    const verificationLink = `http://localhost:8000/api/auth/verify-email?token=${data.verificationToken}&email=${data.email}`;

    await emailService.sendMail({
      to: data.email,
      subject: "Welcome to LearnSphere! Please verify your email",
      text: `Welcome! Please verify your email by clicking this link: ${verificationLink}`,
      html: `
      <h1>Welcome to LearnSphere</h1>
      <p>Thanks to signing up. Please click the link below to verify your email address.</p>
      <a href="${verificationLink}" style="padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>This link will expire in 2 hours.</p>
      `,
    });
  }
}

interface UserPasswordResetRequiredEvent {
  topic: "user.password_reset.required";
  data: {
    email: string;
    resetToken: string;
  };
}

export class UserPasswordResetRequiredListener extends Listener<UserPasswordResetRequiredEvent> {
  topic: "user.password_reset.required" = "user.password_reset.required";
  queueGroupName: string = "notification-service-password-reset";

  async onMessage(
    data: { email: string; resetToken: string },
    msg: ConsumeMessage
  ): Promise<void> {
    logger.info(`Password reset event received for: ${data.email}`);

    const resetLink = `http://localhost:8000/api/auth/reset-password?token=${data.resetToken}&email=${data.email}`;

    await emailService.sendMail({
      to: data.email,
      subject: "LearnSphere Password Reset Request",
      text: `You requested a password reset. Please use the following link: ${resetLink}`,
      html: `
  <h1>Password Reset Requested</h1>
  <p>You (or someone else) requested a password reset for your account. If this was not you, you can safely ignore this email.</p>
  <p>Click the link below to set a new password:</p>
  <a href="${resetLink}" style="padding: 10px 15px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
  <p>This link will expire in 15 minutes.</p>
  `,
    });
  }
}
