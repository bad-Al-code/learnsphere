import { ConsumeMessage } from 'amqplib';

import { eq, sql } from 'drizzle-orm';
import logger from '../config/logger';
import { db } from '../db';
import { CourseRepository } from '../db/course.repository';
import { courses, dailyActivity } from '../db/schema';
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
    status: 'draft' | 'published';
    prerequisiteCourseId: string | null;
    price: string | null;
    currency: string | null;
    title?: string | null;
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
        instructorId: data.instructorId,
        status: data.status,
        prerequisiteCourseId: data.prerequisiteCourseId,
        price: data.price,
        currency: data.currency,
        title: data.title,
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
