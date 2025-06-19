import logger from "../config/logger";
import { rabbitMQConnection } from "./connection";

export abstract class Publisher<T extends { topic: string; data: any }> {
  abstract topic: T["topic"];
  protected exchange = "learnsphere";
  protected exchangeType = "topic";

  async publish(data: T["data"]): Promise<void> {
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
  topic: "user.enrolled";
  data: {
    userId: string;
    courseId: string;
    enrollmentId: string;
    enrolledAt: Date;
  };
}

export class UserEnrollmentPublisher extends Publisher<UserEnrollmentEvent> {
  topic: "user.enrolled" = "user.enrolled";
}

interface StudentProgressUpdateEvent {
  topic: "student.progress.updated";
  data: {
    userId: string;
    courseId: string;
    lessonId: string;
    progressPercentage: number;
  };
}

export class StudentProgressUpdatePublisher extends Publisher<StudentProgressUpdateEvent> {
  topic: "student.progress.updated" = "student.progress.updated";
}

interface StudentCourseCompletedEvent {
  topic: "student.course.completed";
  data: {
    userId: string;
    courseId: string;
    enrollmentId: string;
    completedAt: Date;
  };
}

export class StudentCourseCompletedPublisher extends Publisher<StudentCourseCompletedEvent> {
  topic: "student.course.completed" = "student.course.completed";
}
