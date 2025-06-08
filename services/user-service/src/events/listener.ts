import { ConsumeMessage } from "amqplib";
import logger from "../config/logger";
import { rabbitMQConnection } from "./connection";

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
          logger.debug(`Message received from topic [${this.topic}]`);
          const parsedData = JSON.parse(msg.content.toString());
          this.onMessage(parsedData, msg);

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

interface UserRegisteredEvent extends Event {
  topic: "user.registered";
  data: {
    id: string;
    email: string;
  };
}

export class UserRegisteredListener extends Listener<UserRegisteredEvent> {
  topic: "user.registered" = "user.registered";
  queueGroupName: string = "user-service";
  onMessage(data: { id: string; email: string }, msg: ConsumeMessage): void {
    logger.info(`Event data received!`, {
      topic: this.topic,
      data,
    });

    // TODO: save to the database
  }
}
