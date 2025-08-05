import logger from '../config/logger';
import { rabbitMQConnection } from './connection';

export abstract class Publisher<T extends { topic: string; data: object }> {
  abstract topic: T['topic'];
  protected exchange = 'learnsphere';
  protected exchangeType = 'topic';

  async publish(data: T['data']): Promise<void> {
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
  topic: 'user.avatar.processed';
  data: {
    userId: string;
    avatarUrls: {
      small?: string;
      medium?: string;
      large?: string;
    };
  };
}

export class UserAvatarProcessedPublisher extends Publisher<UserAvatarProcessedEvent> {
  readonly topic: 'user.avatar.processed' = 'user.avatar.processed' as const;
}

interface UserAvatarFailedEvent {
  topic: 'user.avatar.failed';
  data: {
    userId: string;
    reason: string;
  };
}

export class UserAvatarFailedPublisher extends Publisher<UserAvatarFailedEvent> {
  readonly topic: 'user.avatar.failed' = 'user.avatar.failed' as const;
}

interface VideoProcessedEvent {
  topic: 'video.processed';
  data: {
    lessonId: string;
    videoUrl: string;
  };
}

export class VideoProcessedPublisher extends Publisher<VideoProcessedEvent> {
  readonly topic: 'video.processed' = 'video.processed' as const;
}

interface CourseThumbnailProcessedEvent {
  topic: 'course.thumbnail.processed';
  data: {
    courseId: string;
    imageUrl: string;
  };
}

export class CourseThumbnailProcessedPublisher extends Publisher<CourseThumbnailProcessedEvent> {
  readonly topic: 'course.thumbnail.processed' =
    'course.thumbnail.processed' as const;
}
