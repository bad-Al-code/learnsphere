import { rabbitMQConnection } from './connection';

import { Options } from 'amqplib';
import logger from '../config/logger';

export abstract class Publisher<T extends { topic: string; data: unknown }> {
  abstract topic: T['topic'];
  protected exchange = 'learnsphere';
  protected exchangeType = 'topic';

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

interface InstructorApplicationSubmittedEvent {
  topic: 'instructor.application.submitted';
  data: {
    userId: string;
    userName: string;
    userEmail: string;
    applicationData: {
      expertise: string;
    };
    submittedAt: string;
  };
}

export class InstructorApplicationSubmittedPublisher extends Publisher<InstructorApplicationSubmittedEvent> {
  readonly topic: 'instructor.application.submitted' =
    'instructor.application.submitted' as const;
}

interface InstructorApplicationDeclinedEvent {
  topic: 'instructor.application.declined';
  data: {
    userId: string;
    userName: string;
    userEmail: string;
    reason?: string;
  };
}

export class InstructorApplicationDeclinedPublisher extends Publisher<InstructorApplicationDeclinedEvent> {
  readonly topic = 'instructor.application.declined' as const;
}

interface InstructorApplicationApprovedEvent {
  topic: 'instructor.application.approved';
  data: {
    userId: string;
    userEmail: string;
    userName: string;
  };
}

export class InstructorApplicationApprovedPublisher extends Publisher<InstructorApplicationApprovedEvent> {
  readonly topic = 'instructor.application.approved' as const;
}

interface UserJoinedWaitlistEvent {
  topic: 'user.joined.waitlist';
  data: {
    email: string;
    joinedAt: Date;
  };
}
export class UserJoinedWaitlistPublisher extends Publisher<UserJoinedWaitlistEvent> {
  readonly topic: 'user.joined.waitlist' = 'user.joined.waitlist' as const;
}

interface UserRewardUnlockedEvent {
  topic: 'user.reward.unlocked';
  data: {
    userId: string;
    email: string;
    rewardId: string;
    reward?: string;
    referralCount: number;
    unlockedAt: Date;
  };
}

export class UserRewardUnlockedPublisher extends Publisher<UserRewardUnlockedEvent> {
  readonly topic = 'user.reward.unlocked' as const;
}

interface WaitlistNurtureWeek1Event {
  topic: 'waitlist.nurture.week1';
  data: {
    email: string;
    joinedAt: Date;
  };
}

export class WaitlistNurtureWeek1Publisher extends Publisher<WaitlistNurtureWeek1Event> {
  readonly topic = 'waitlist.nurture.week1' as const;
  protected exchange = 'delay.exchange';
}
