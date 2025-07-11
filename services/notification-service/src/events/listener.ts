import { ConsumeMessage } from "amqplib";

import logger from "../config/logger";
import { rabbitMQConnection } from "./connection";
import { EmailService } from "../services/email-service";

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
  readonly topic: "user.verification.required" =
    "user.verification.required" as const;
  queueGroupName = "notification-service-verification";
  private emailService: EmailService;

  constructor(emailService: EmailService) {
    super();
    this.emailService = emailService;
  }

  async onMessage(
    data: { email: string; verificationToken: string },
    _msg: ConsumeMessage
  ): Promise<void> {
    logger.info(`Verification event received for: ${data.email}`);

    await this.emailService.sendVerificationEmail(data);
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
  readonly topic: "user.password_reset.required" =
    "user.password_reset.required" as const;
  queueGroupName: string = "notification-service-password-reset";
  private emailService: EmailService;

  constructor(emailService: EmailService) {
    super();

    this.emailService = emailService;
  }

  async onMessage(
    data: { email: string; resetToken: string },
    _msg: ConsumeMessage
  ): Promise<void> {
    logger.info(`Password reset event received for: ${data.email}`);

    await this.emailService.sendPasswordResetEmail(data);
  }
}
