import { ConsumeMessage } from 'amqplib';

import { eq, sql } from 'drizzle-orm';
import logger from '../config/logger';
import { db } from '../db';
import {
  AnalyticsRepository,
  CourseRepository,
  StudentGradeRepository,
} from '../db/repositories';
import { courses, dailyActivity } from '../db/schema';
import { EnrollmentService } from '../services/enrollment.service';
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
          // logger.debug(`Message received from topic [${this.topic}]`);
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

interface CourseCreatedEvent {
  topic: 'course.created';
  data: {
    courseId: string;
    instructorId: string;
    title: string;
    status: 'draft' | 'published';
    prerequisiteCourseId: string | null;
    price: string | null;
    currency: string | null;
  };
}

export class CourseSyncCreatedListener extends Listener<CourseCreatedEvent> {
  readonly topic = 'course.created' as const;
  queueGroupName = 'enrollment-service-course-created';

  async onMessage(data: CourseCreatedEvent['data'], _msg: ConsumeMessage) {
    try {
      logger.info(`Syncing new course: ${data.courseId}`);

      await CourseRepository.upsert({
        id: data.courseId,
        title: data.title,
        instructorId: data.instructorId,
        status: data.status,
        prerequisiteCourseId: data.prerequisiteCourseId,
        price: data.price,
        currency: data.currency,
      });
    } catch (error) {
      logger.error('Failed to sync created course', { data, error });
    }
  }
}

interface CourseUpdatedEvent {
  topic: 'course.updated';
  data: {
    courseId: string;
    newStatus?: 'draft' | 'published';
    newPrerequisiteCourseId?: string | null;
    newPrice?: string | null;
    newTitle?: string;
  };
}

export class CourseSyncUpdatedListener extends Listener<CourseUpdatedEvent> {
  readonly topic = 'course.updated' as const;
  queueGroupName = 'enrollment-service-course-updated';

  async onMessage(data: CourseUpdatedEvent['data'], _msg: ConsumeMessage) {
    try {
      logger.info(`Syncing update for course: ${data.courseId}`);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = {};
      if (data.newStatus) updateData.status = data.newStatus;
      if (data.newPrerequisiteCourseId !== undefined) {
        updateData.prerequisiteCourseId = data.newPrerequisiteCourseId;
      }
      if (data.newPrice !== undefined) {
        updateData.price = data.newPrice;
      }

      if (data.newTitle !== undefined) {
        updateData.title = data.newTitle;
      }

      if (Object.keys(updateData).length > 0) {
        await CourseRepository.update(data.courseId, updateData);
      }
    } catch (error) {
      logger.error('Failed to sync updated course', { data, error });
    }
  }
}

interface CourseDeletedEvent {
  topic: 'course.deleted';
  data: { courseId: string };
}

export class CourseSyncDeletedListener extends Listener<CourseDeletedEvent> {
  readonly topic = 'course.deleted' as const;
  queueGroupName = 'enrollment-service-course-deleted';

  async onMessage(data: CourseDeletedEvent['data'], _msg: ConsumeMessage) {
    try {
      logger.info(`Syncing deletion for course: ${data.courseId}`);

      await CourseRepository.delete(data.courseId);
    } catch (error) {
      logger.error('Failed to sync deleted course', { data, error });
    }
  }
}

export interface DiscussionPostCreatedEvent {
  topic: 'discussion.post.created';
  data: {
    courseId: string;
    userId: string;
    discussionId: string;
    createdAt: Date;
  };
}

export class DiscussionPostCreatedListener extends Listener<DiscussionPostCreatedEvent> {
  readonly topic = 'discussion.post.created' as const;
  queueGroupName = 'enrollment-service-discussion-activity';

  async onMessage(
    data: DiscussionPostCreatedEvent['data'],
    _msg: ConsumeMessage
  ) {
    try {
      const course = await db.query.courses.findFirst({
        where: eq(courses.id, data.courseId),
        columns: {
          instructorId: true,
        },
      });

      if (!course) {
        logger.warn(
          `Course not found for discussion event, ignoring. CourseID: ${data.courseId}`
        );
        return;
      }

      const today = new Date().toISOString().split('T')[0];

      await db
        .insert(dailyActivity)
        .values({
          instructorId: course.instructorId,
          date: today,
          discussions: 1,
        })
        .onConflictDoUpdate({
          target: [dailyActivity.instructorId, dailyActivity.date],
          set: {
            discussions: sql`${dailyActivity.discussions} + 1`,
          },
        });

      await AnalyticsRepository.createActivityLog({
        courseId: data.courseId,
        userId: data.userId,
        activityType: 'discussion_post',
        metadata: { discussionId: data.discussionId },
        createdAt: new Date(data.createdAt),
      });

      logger.info(
        `Logged discussion activity for instructor ${course.instructorId} on ${today}`
      );
    } catch (error) {
      logger.error('Failed to process discussion.post.created event', {
        data,
        error,
      });
    }
  }
}

interface UserSessionCreatedEvent {
  topic: 'user.session.created';
  data: {
    userId: string;
    deviceType: string | null;
  };
}

export class UserSessionCreatedListener extends Listener<UserSessionCreatedEvent> {
  readonly topic: 'user.session.created' = 'user.session.created' as const;
  queueGroupName: string = 'enrollment-service-session-activity';

  async onMessage(data: UserSessionCreatedEvent['data'], _msg: ConsumeMessage) {
    try {
      const coursesTaught = await CourseRepository.findAllByInstructorId(
        data.userId
      );
      if (coursesTaught.length === 0) {
        return;
      }

      const today = new Date().toISOString().split('T')[0];

      await db
        .insert(dailyActivity)
        .values({ instructorId: data.userId, date: today, logins: 1 })
        .onConflictDoUpdate({
          target: [dailyActivity.instructorId, dailyActivity.date],
          set: {
            logins: sql`${dailyActivity.logins} + 1`,
          },
        });

      logger.info(
        `Logged login activity for instructor ${data.userId} on ${today}`
      );
    } catch (error) {
      logger.error('Failed to process user.session.created event', {
        data,
        error,
      });
    }
  }
}

interface AssignmentSubmissionGradedEvent {
  topic: 'assignment.submission.graded';
  data: {
    submissionId: string;
    assignmentId: string;
    courseId: string;
    studentId: string;
    grade: number;
    gradedAt: Date;
  };
}

export class GradeSyncListener extends Listener<AssignmentSubmissionGradedEvent> {
  readonly topic = 'assignment.submission.graded' as const;
  queueGroupName = 'enrollment-service-grade-sync';

  async onMessage(
    data: AssignmentSubmissionGradedEvent['data'],
    _msg: ConsumeMessage
  ) {
    try {
      logger.info(`Syncing grade for submission: ${data.submissionId}`);

      await StudentGradeRepository.upsert({
        submissionId: data.submissionId,
        assignmentId: data.assignmentId,
        courseId: data.courseId,
        studentId: data.studentId,
        grade: data.grade,
        gradedAt: new Date(data.gradedAt),
      });
    } catch (error) {
      logger.error('Failed to sync assignment grade', { data, error });
    }
  }
}

interface PaymentSuccessfulEvent {
  topic: 'payment.successful';
  data: {
    userId: string;
    courseId: string;
    paymentId: string;
    completedAt: Date;
  };
}

export class PaymentSuccessListener extends Listener<PaymentSuccessfulEvent> {
  readonly topic = 'payment.successful' as const;
  queueGroupName = 'enrollment-service-payment-success';

  async onMessage(data: PaymentSuccessfulEvent['data'], _msg: ConsumeMessage) {
    try {
      logger.info(
        `Processing successful payment for user ${data.userId} in course ${data.courseId}`
      );

      await EnrollmentService.enrollUserInCourse({
        userId: data.userId,
        courseId: data.courseId,
      });

      await AnalyticsRepository.createActivityLog({
        courseId: data.courseId,
        userId: data.userId,
        activityType: 'enrollment',
        metadata: { paymentId: data.paymentId },
        createdAt: new Date(data.completedAt),
      });
      logger.info(`Logged 'enrollment' activity for course ${data.courseId}`);
    } catch (err) {
      const error = err as Error;

      if (error.message && error.message.includes('already enrolled')) {
        logger.warn(
          `User ${data.userId} already enrolled in course ${data.courseId}. Ignoring event.`
        );
      } else {
        logger.error('Failed to process payment.successful event', {
          data,
          error: error.message,
        });
      }
    }
  }
}

interface ResourceDownloadedEvent {
  topic: 'resource.downloaded';
  data: {
    resourceId: string;
    courseId: string;
    userId: string;
    downloadedAt: Date;
  };
}

export class ResourceDownloadedListener extends Listener<ResourceDownloadedEvent> {
  readonly topic = 'resource.downloaded' as const;
  queueGroupName = 'enrollment-service-resource-download';

  async onMessage(data: ResourceDownloadedEvent['data'], _msg: ConsumeMessage) {
    try {
      logger.info(
        `Logging 'resource_download' activity for course ${data.courseId}`
      );

      await AnalyticsRepository.createActivityLog({
        courseId: data.courseId,
        userId: data.userId,
        activityType: 'resource_download',
        metadata: { resourceId: data.resourceId },
        createdAt: new Date(data.downloadedAt),
      });
    } catch (error) {
      logger.error('Failed to log resource download activity', { data, error });
    }
  }
}
