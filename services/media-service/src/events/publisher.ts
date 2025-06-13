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
      `Event published to exchange '${this.exchange}' with topic '${this.topic}': %o`,
      data
    );
  }
}

interface UserAvatarProcessedEvent {
  topic: "user.avatar.processed";
  data: {
    userId: string;
    avatarUrl: string;
  };
}

export class UserAvatarProcessedPublisher extends Publisher<UserAvatarProcessedEvent> {
  topic: "user.avatar.processed" = "user.avatar.processed";
}
