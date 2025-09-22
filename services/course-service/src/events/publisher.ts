import { Options } from 'amqplib';
import logger from '../config/logger';
import { rabbitMQConnection } from './connection';

export abstract class Publisher<T extends { topic: string; data: unknown }> {
  abstract topic: T['topic'];
  protected exchange = 'learnsphere';
  protected exchangeType = 'topic';

  /**
   * Publish an event to the exchange
   * @param data - The event payload
   * @param options - Optional RabbitMQ publish options, e.g., { expiration: 60000 }
   */
  async publish(data: T['data'], options?: Options.Publish): Promise<void> {
    const channel = rabbitMQConnection.getChannel();
    await channel.assertExchange(this.exchange, this.exchangeType, {
      durable: true,
    });

    const message = JSON.stringify(data);

    channel.publish(this.exchange, this.topic, Buffer.from(message), options);

    logger.info(
      `Event published to exchange '${this.exchange}' with topic '${this.topic}': %o`,
      { data, options }
    );
  }
}

interface CourseCreatedEvent {
  topic: 'course.created';
  data: {
    courseId: string;
    instructorId: string;
    status: 'draft' | 'published';
    prerequisiteCourseId: string | null;
    price: string | null;
    currency: string | null;
    title: string;
  };
}

export class CourseCreatedPublisher extends Publisher<CourseCreatedEvent> {
  readonly topic: 'course.created' = 'course.created' as const;
}

interface CourseUpdatedEvent {
  topic: 'course.updated';
  data: {
    courseId: string;
    newStatus?: 'draft' | 'published';
    newPrerequisiteCourseId?: string | null;
    newInstructorId?: string;
    newPrice?: string | null;
  };
}
export class CourseUpdatedPublisher extends Publisher<CourseUpdatedEvent> {
  readonly topic = 'course.updated' as const;
}

interface CourseDeletedEvent {
  topic: 'course.deleted';
  data: {
    courseId: string;
  };
}
export class CourseDeletedPublisher extends Publisher<CourseDeletedEvent> {
  readonly topic = 'course.deleted' as const;
}

export interface DiscussionPostCreatedEvent {
  topic: 'discussion.post.created';
  data: {
    discussionId: string;
    courseId: string;
    userId: string;
    createdAt: Date;
  };
}

export class DiscussionPostCreatedPublisher extends Publisher<DiscussionPostCreatedEvent> {
  readonly topic = 'discussion.post.created' as const;
}

export interface AssignmentSubmissionGradedEvent {
  topic: 'assignment.submission.graded';
  data: {
    submissionId: string;
    assignmentId: string;
    courseId: string;
    moduleId: string;
    studentId: string;
    grade: number;
    gradedAt: Date;
  };
}

export class AssignmentSubmissionGradedPublisher extends Publisher<AssignmentSubmissionGradedEvent> {
  readonly topic = 'assignment.submission.graded' as const;
}

export interface ResourceDownloadedEvent {
  topic: 'resource.downloaded';
  data: {
    resourceId: string;
    courseId: string;
    userId: string;
    downloadedAt: Date;
  };
}

export class ResourceDownloadedPublisher extends Publisher<ResourceDownloadedEvent> {
  readonly topic = 'resource.downloaded' as const;
}

interface CourseContentUpdatedEvent {
  topic: 'course.content.updated';
  data: {
    courseId: string;
    content: string;
  };
}

export class CourseContentUpdatedPublisher extends Publisher<CourseContentUpdatedEvent> {
  readonly topic = 'course.content.updated' as const;
}

interface AIFeedbackReadyEvent {
  topic: 'ai.feedback.ready';
  data: {
    submissionId: string;
    studentId: string;
    courseId: string;
  };
}

export class AIFeedbackReadyPublisher extends Publisher<AIFeedbackReadyEvent> {
  readonly topic: 'ai.feedback.ready' = 'ai.feedback.ready' as const;
  protected exchange = 'delay.exchange';
  protected exchangeType = 'direct';
}
