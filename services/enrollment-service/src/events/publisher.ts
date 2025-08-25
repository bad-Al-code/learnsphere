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

interface UserEnrollmentEvent {
  topic: 'user.enrolled';
  data: {
    userId: string;
    courseId: string;
    enrollmentId: string;
    enrolledAt: Date;
    instructorId?: string;
  };
}

export class UserEnrollmentPublisher extends Publisher<UserEnrollmentEvent> {
  readonly topic: 'user.enrolled' = 'user.enrolled' as const;
}

interface StudentProgressUpdateEvent {
  topic: 'student.progress.updated';
  data: {
    userId: string;
    courseId: string;
    lessonId: string;
    progressPercentage: number;
  };
}

export class StudentProgressUpdatePublisher extends Publisher<StudentProgressUpdateEvent> {
  readonly topic: 'student.progress.updated' =
    'student.progress.updated' as const;
}

interface StudentCourseCompletedEvent {
  topic: 'student.course.completed';
  data: {
    userId: string;
    courseId: string;
    enrollmentId: string;
    completedAt: Date;
  };
}

export class StudentCourseCompletedPublisher extends Publisher<StudentCourseCompletedEvent> {
  readonly topic: 'student.course.completed' =
    'student.course.completed' as const;
}

interface UserEnrollmentSuspendedEvent {
  topic: 'user.enrollment.suspended';
  data: {
    userId: string;
    courseId: string;
    enrollmentId: string;
    suspendedAt: Date;
    reason?: string;
  };
}

export class UserEnrollmentSuspendedPublisher extends Publisher<UserEnrollmentSuspendedEvent> {
  readonly topic: 'user.enrollment.suspended' =
    'user.enrollment.suspended' as const;
}

interface UserEnrollmentReactivatedEvent {
  topic: 'user.enrollment.reactivated';
  data: {
    userId: string;
    courseId: string;
    enrollmentId: string;
    reactivatedAt: Date;
  };
}

export class UserEnrollmentReactivatedPublisher extends Publisher<UserEnrollmentReactivatedEvent> {
  readonly topic: 'user.enrollment.reactivated' =
    'user.enrollment.reactivated' as const;
}

interface StudentProgressResetEvent {
  topic: 'student.progress.reset';
  data: {
    userId: string;
    courseId: string;
    enrollmentId: string;
    resetAt: Date;
  };
}

export class StudentProgressResetPublisher extends Publisher<StudentProgressResetEvent> {
  readonly topic: 'student.progress.reset' = 'student.progress.reset' as const;
}
