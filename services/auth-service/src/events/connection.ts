import amqp, { Channel, ChannelModel } from "amqplib";
import logger from "../config/logger";

class RabbitMQConnection {
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;

  public async connect(): Promise<void> {
    if (this.connection) {
      logger.info("RabbitMQ already connected.");
      return;
    }

    const rabbitUrl = process.env.RABBITMQ_URL;
    if (!rabbitUrl) {
      throw new Error("Missing RABBITMQ_URL in environment.");
    }

    try {
      logger.info("Connecting to RabbitMQ...");

      const connection = await amqp.connect(rabbitUrl);
      const channel = await connection.createChannel();

      this.connection = connection;
      this.channel = channel;

      logger.info("RabbitMQ connected successfully.");

      this.channel.on("close", () => {
        logger.warn("RabbitMQ channel closed.");
        this.channel = null;
      });

      this.channel.on("error", (err) => {
        logger.error("RabbitMQ channel error", { error: err.message });
      });
    } catch (err) {
      logger.error("Failed to connect to RabbitMQ", {
        error: (err as Error).message,
      });
      throw err;
    }
  }

  public getChannel(): Channel {
    if (!this.channel) {
      throw new Error("RabbitMQ channel not available. Call connect() first.");
    }
    return this.channel;
  }

  public async close(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
        logger.info("RabbitMQ channel closed.");
      }

      if (this.connection) {
        const conn = this.connection;
        await conn.close();
        logger.info("RabbitMQ connection closed.");
      }
    } catch (err) {
      logger.error("Error closing RabbitMQ", {
        error: (err as Error).message,
      });
    } finally {
      this.channel = null;
      this.connection = null;
    }
  }
}

export const rabbitMQConnection = new RabbitMQConnection();
