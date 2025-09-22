import { ConsumeMessage } from 'amqplib';
import { eq } from 'drizzle-orm';
import logger from '../config/logger';
import { db } from '../db';
import { courses, lessons } from '../db/schema';
import { AIRepository } from '../features/ai/ai.repository';
import { CourseCacheService } from '../services';
import { rabbitMQConnection } from './connection';

interface Event {
  topic: string;
  data: object;
}

export abstract class Listener<T extends Event> {
  abstract topic: T['topic'];
  abstract queueGroupName: string;
  abstract onMessage(data: T['data'], msg: ConsumeMessage): void;

  protected exchange = 'learnsphere';
  protected exchangeType = 'topic';

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
  topic: 'video.processed';
  data: {
    lessonId: string;
    videoUrl: string;
  };
}

export class VideoProcessedListener extends Listener<VideoProcessedEvent> {
  readonly topic: 'video.processed' = 'video.processed' as const;
  queueGroupName: string = 'course-service-video';

  async onMessage(
    data: { lessonId: string; videoUrl: string },
    _msg: ConsumeMessage
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

interface CourseThumbnailProcessedEvent {
  topic: 'course.thumbnail.processed';
  data: {
    courseId: string;
    imageUrl: string;
  };
}

export class CourseThumbnailProcessedListener extends Listener<CourseThumbnailProcessedEvent> {
  readonly topic = 'course.thumbnail.processed' as const;
  queueGroupName = 'course-service-thumbnail';

  async onMessage(
    data: CourseThumbnailProcessedEvent['data'],
    _msg: ConsumeMessage
  ) {
    logger.info(
      `Thumbnail processed event received for course: ${data.courseId}`
    );

    try {
      await db
        .update(courses)
        .set({ imageUrl: data.imageUrl })
        .where(eq(courses.id, data.courseId));

      await CourseCacheService.invalidateCacheDetails(data.courseId);

      logger.info(`Course ${data.courseId} updated with new thumbnail URL.`);
    } catch (error) {
      logger.error(`Failed to update course with thumbnail URL`, {
        data,
        error,
      });
    }
  }
}

interface AIFeedbackDeliveredEvent {
  topic: 'notification.feedback.delivered';
  data: { submissionId: string };
}

export class AIFeedbackDeliveredListener extends Listener<AIFeedbackDeliveredEvent> {
  readonly topic = 'notification.feedback.delivered' as const;
  queueGroupName = 'course-service-feedback-delivered';

  async onMessage(
    data: AIFeedbackDeliveredEvent['data'],
    _msg: ConsumeMessage
  ) {
    try {
      logger.info(
        `Received confirmation for feedback delivery on submission ${data.submissionId}. Updating status.`
      );

      await AIRepository.updateFeedbackStatus(data.submissionId, 'reviewed');
    } catch (error) {
      logger.error(
        `Failed to update feedback status for submission ${data.submissionId}`,
        { error }
      );
    }
  }
}
