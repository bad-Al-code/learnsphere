import { ConsumeMessage } from "amqplib";
import logger from "../config/logger";
import { rabbitMQConnection } from "./connection";
import { db } from "../db";
import { lessons } from "../db/schema";
import { eq } from "drizzle-orm";

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

interface VideoProcessedEvent {
  topic: "video.processed";
  data: {
    lessonId: string;
    videoUrl: string;
  };
}

export class VideoProcessedListener extends Listener<VideoProcessedEvent> {
  topic: "video.processed" = "video.processed";
  queueGroupName: string = "course-service-video";

  async onMessage(
    data: { lessonId: string; videoUrl: string },
    msg: ConsumeMessage
  ): Promise<void> {
    logger.info(`Video procesed event received for lesson" ${data.lessonId}`);

    try {
      await db
        .update(lessons)
        .set({ contentId: data.videoUrl })
        .where(eq(lessons.id, data.lessonId));

      logger.info(`Lesson ${data.lessonId} updated with video URL.`);
    } catch (error) {
      logger.error(`Failed to update lesson with video URL`, {
        lessonId: data.lessonId,
        error,
      });

      throw error;
    }
  }
}
