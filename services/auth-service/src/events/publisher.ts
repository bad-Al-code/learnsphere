import logger from "../config/logger";
import { rabbitMQConnection } from "./connection";

export abstract class Publisher<T extends { topic: string; data: any }> {
  abstract topic: T["topic"];
  protected exchange = "learnsphere";
  protected exchangeType = "topic";

  async publish(data: T["data"]): Promise<void> {
    const channel = rabbitMQConnection.getChannel();
    await channel.assertExchange(this.exchange, this.exchangeType, {
      durable: true,
    });

    const message = JSON.stringify(data);

    channel.publish(this.exchange, this.topic, Buffer.from(message));

    logger.info(
      `Event published to exchange '${this.exchange}' with topic '${this.topic}'`,
      { data }
    );
  }
}

interface UserRegisteredEvent {
  topic: "user.registered";
  data: {
    id: string;
    email: string;
  };
}

export class UserRegisteredPublisher extends Publisher<UserRegisteredEvent> {
  topic: "user.registered" = "user.registered";
}

interface UserVerificationRequiredEvent {
  topic: "user.verification.required";
  data: {
    email: string;
    verificationToken: string;
  };
}

export class UserVerificationRequiredPublisher extends Publisher<UserVerificationRequiredEvent> {
  topic: "user.verification.required" = "user.verification.required";
}
