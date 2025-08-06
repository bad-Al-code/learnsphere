import { ConsumeMessage } from 'amqplib';

import logger from '../config/logger';
import { CourseRepository } from '../db/course.repository';
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

interface CourseCreatedEvent {
  topic: 'course.created';
  data: {
    courseId: string;
    instructorId: string;
    status: 'draft' | 'published';
    prerequisiteCourseId: string | null;
  };
}

export class CourseSyncCreatedListener extends Listener<CourseCreatedEvent> {
  readonly topic = 'course.created' as const;
  queueGroupName = 'enrollment-service-course-sync';

  async onMessage(data: CourseCreatedEvent['data'], _msg: ConsumeMessage) {
    try {
      logger.info(`Syncing new course: ${data.courseId}`);

      await CourseRepository.upsert({
        id: data.courseId,
        instructorId: data.instructorId,
        status: data.status,
        prerequisiteCourseId: data.prerequisiteCourseId,
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
  };
}

export class CourseSyncUpdatedListener extends Listener<CourseUpdatedEvent> {
  readonly topic = 'course.updated' as const;
  queueGroupName = 'enrollment-service-course-sync';

  async onMessage(data: CourseUpdatedEvent['data'], _msg: ConsumeMessage) {
    try {
      logger.info(`Syncing update for course: ${data.courseId}`);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = {};
      if (data.newStatus) updateData.status = data.newStatus;
      if (data.newPrerequisiteCourseId !== undefined) {
        updateData.prerequisiteCourseId = data.newPrerequisiteCourseId;
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
  queueGroupName = 'enrollment-service-course-sync';

  async onMessage(data: CourseDeletedEvent['data'], _msg: ConsumeMessage) {
    try {
      logger.info(`Syncing deletion for course: ${data.courseId}`);

      await CourseRepository.delete(data.courseId);
    } catch (error) {
      logger.error('Failed to sync deleted course', { data, error });
    }
  }
}
