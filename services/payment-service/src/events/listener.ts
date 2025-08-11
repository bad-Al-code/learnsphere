import { ConsumeMessage } from 'amqplib';

import logger from '../config/logger';
import { CourseRepository, UserRepository } from '../db/repostiories';
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
          try {
            const parsedData = JSON.parse(msg.content.toString());
            this.onMessage(parsedData, msg);
          } catch (err) {
            logger.error('Error handling message', {
              topic: this.topic,
              error: err,
            });
          } finally {
            channel.ack(msg);
          }
        }
      });
    };
    setup().catch((err) =>
      logger.error(`Error setting up listener`, { error: err })
    );
  }
}

interface CourseCreatedEvent {
  topic: 'course.created';
  data: {
    courseId: string;
    instructorId: string;
    title: string;
    price: string;
    currency: string;
  };
}

export class CourseSyncCreatedListener extends Listener<CourseCreatedEvent> {
  readonly topic = 'course.created' as const;
  queueGroupName = 'payment-service-course-created';

  async onMessage(data: CourseCreatedEvent['data'], _msg: ConsumeMessage) {
    try {
      logger.info(`Syncing new course: ${data.courseId}`);
      await CourseRepository.upsert({
        id: data.courseId,
        instructorId: data.instructorId,
        title: data.title,
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
  data: { courseId: string; newPrice?: string; newTitle?: string };
}

export class CourseSyncUpdatedListener extends Listener<CourseUpdatedEvent> {
  readonly topic = 'course.updated' as const;
  queueGroupName = 'payment-service-course-updated';

  async onMessage(data: CourseUpdatedEvent['data'], _msg: ConsumeMessage) {
    try {
      logger.info(`Syncing update for course: ${data.courseId}`);
      const updateData: { price?: string; title?: string } = {};
      if (data.newPrice !== undefined) updateData.price = data.newPrice;
      if (data.newTitle !== undefined) updateData.title = data.newTitle;

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
  queueGroupName = 'payment-service-course-deleted';

  async onMessage(data: CourseDeletedEvent['data'], _msg: ConsumeMessage) {
    try {
      logger.info(`Syncing deletion for course: ${data.courseId}`);
      await CourseRepository.delete(data.courseId);
    } catch (error) {
      logger.error('Failed to sync deleted course', { data, error });
    }
  }
}

interface UserRegisteredEvent {
  topic: 'user.registered';
  data: { id: string; email: string };
}

export class UserSyncRegisteredListener extends Listener<UserRegisteredEvent> {
  readonly topic = 'user.registered' as const;
  queueGroupName = 'payment-service-user-registered';

  async onMessage(data: UserRegisteredEvent['data'], _msg: ConsumeMessage) {
    try {
      logger.info(`Syncing new user: ${data.id}`);
      await UserRepository.upsert({
        id: data.id,
        email: data.email,
        // The 'user.registered' event contract does not specify a role.
        // We assume 'student' as the default, which will be corrected
        // by the UserSyncRoleUpdatedListener if the role changes.
        role: 'student',
      });
    } catch (error) {
      logger.error('Failed to sync registered user', { data, error });
    }
  }
}

interface UserRoleUpdatedEvent {
  topic: 'user.role.updated';
  data: {
    userId: string;
    newRole: 'student' | 'instructor' | 'admin';
    userEmail: string;
  };
}

export class UserSyncRoleUpdatedListener extends Listener<UserRoleUpdatedEvent> {
  readonly topic = 'user.role.updated' as const;
  queueGroupName = 'payment-service-user-role-updated';

  async onMessage(data: UserRoleUpdatedEvent['data'], _msg: ConsumeMessage) {
    try {
      logger.info(`Syncing role update for user: ${data.userId}`);
      await UserRepository.upsert({
        id: data.userId,
        email: data.userEmail,
        role: data.newRole,
      });
    } catch (error) {
      logger.error('Failed to sync user role update', { data, error });
    }
  }
}
