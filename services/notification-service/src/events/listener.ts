import { ConsumeMessage } from 'amqplib';

import logger from '../config/logger';
import { UserRepository } from '../db/user.respository';
import { EmailService } from '../services/email-service';
import { NotificationService } from '../services/notification.service';
import { rabbitMQConnection } from './connection';
import { AIFeedbackDeliveredPublisher } from './publisher';

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
          if (msg.fields.routingKey === this.topic) {
            logger.debug(`Message received from topic [${this.topic}]`);

            try {
              const parsedData = JSON.parse(msg.content.toString());
              this.onMessage(parsedData, msg);
            } catch (err) {
              let error = err as Error;
              logger.error('Error handling message: %o', {
                topic: this.topic,
                queue: this.queueGroupName,
                error: error.message,
                stack: error.stack,
                name: error.name,
              });
            }
          } else {
            logger.debug(
              `Message with topic [${msg.fields.routingKey}] ignored by listener for [${this.topic}]`
            );
          }
          channel.ack(msg);
        }
      });
    };

    setup().catch((err) => {
      let error = err as Error;
      logger.error(`Error setting up listener %o`, {
        queue: this.queueGroupName,
        topic: this.topic,
        error: error.message,
        stack: error.stack,
        name: error.name,
      });
    });
  }
}

interface UserVerificationRequiredEvent {
  topic: 'user.verification.required';
  data: {
    email: string;
    verificationCode: string;
    verificationToken: string;
  };
}

export class UserVerificationRequiredListener extends Listener<UserVerificationRequiredEvent> {
  readonly topic: 'user.verification.required' =
    'user.verification.required' as const;
  queueGroupName = 'notification-service-verification';
  private emailService: EmailService;

  constructor(emailService: EmailService) {
    super();
    this.emailService = emailService;
  }

  async onMessage(
    data: UserVerificationRequiredEvent['data'],
    _msg: ConsumeMessage
  ): Promise<void> {
    try {
      logger.info(`Verification event received for: ${data.email}`);
      await this.emailService.sendVerificationEmail(data);
    } catch (err) {
      let error = err as Error;
      logger.error('Error handling user.verification.required event: %o', {
        email: data.email,
        error: error.message,
        name: error.name,
        stack: error.stack,
      });
    }
  }
}

interface UserPasswordResetRequiredEvent {
  topic: 'user.password_reset.required';
  data: {
    email: string;
    resetCode: string;
    resetToken: string;
  };
}

export class UserPasswordResetRequiredListener extends Listener<UserPasswordResetRequiredEvent> {
  readonly topic: 'user.password_reset.required' =
    'user.password_reset.required' as const;
  queueGroupName: string = 'notification-service-password-reset';
  private emailService: EmailService;

  constructor(emailService: EmailService) {
    super();
    this.emailService = emailService;
  }

  async onMessage(
    data: UserPasswordResetRequiredEvent['data'],
    _msg: ConsumeMessage
  ): Promise<void> {
    try {
      logger.info(`Password reset event received for: ${data.email}`);
      await this.emailService.sendPasswordResetEmail(data);
    } catch (err) {
      let error = err as Error;
      logger.error('Error handling user.password_reset.required event: %o', {
        email: data.email,
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    }
  }
}

interface UserRegisteredEvent extends Event {
  topic: 'user.registered';
  data: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
  };
}

export class UserRegisteredWelcomeListener extends Listener<UserRegisteredEvent> {
  readonly topic = 'user.registered' as const;
  queueGroupName = 'notification-service-welcome';
  private emailService: EmailService;

  constructor(emailService: EmailService) {
    super();
    this.emailService = emailService;
  }

  async onMessage(
    data: UserRegisteredEvent['data'],
    _msg: ConsumeMessage
  ): Promise<void> {
    try {
      logger.info(`Welcome email event received for: ${data.email}`);
      await this.emailService.sendWelcomeEmail({
        email: data.email,
        firstName: data.firstName,
      });
    } catch (err) {
      let error = err as Error;
      logger.error('Error handling user.registered event: %o', {
        email: data.email,
        error: error.message,
        stack: error.stack,
        name: error.name,
      });
    }
  }
}

export class UserSyncRegisteredListener extends Listener<UserRegisteredEvent> {
  readonly topic = 'user.registered' as const;
  queueGroupName = 'notification-service-user-sync';

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
  queueGroupName = 'notification-service-user-role-sync';

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

interface UserPasswordChangedEvent extends Event {
  topic: 'user.password.changed';
  data: {
    userId: string;
    email: string;
  };
}

export class UserPasswordChangedListener extends Listener<UserPasswordChangedEvent> {
  readonly topic = 'user.password.changed' as const;
  queueGroupName = 'notification-service-password-change';
  private emailService: EmailService;

  constructor(emailService: EmailService) {
    super();
    this.emailService = emailService;
  }

  async onMessage(
    data: UserPasswordChangedEvent['data'],
    _msg: ConsumeMessage
  ): Promise<void> {
    try {
      logger.info(`Password change notice event received for: ${data.email}`);
      await Promise.all([
        this.emailService.sendPasswordChangeNotice({ email: data.email }),
        NotificationService.createNotification({
          recipientId: data.userId,
          type: 'SECURITY_ALERT',
          content:
            'Your password was recently changed. If this was not you, please secure your accounr.',
          linkUrl: '/settings/security',
        }),
      ]);
    } catch (err) {
      let error = err as Error;
      logger.error('Error handling user.password.changed event: %o', {
        userId: data.userId,
        error: error.message,
        stack: error.stack,
        name: error.name,
      });
    }
  }
}

interface UserVerifiedEvent extends Event {
  topic: 'user.verified';
  data: {
    userId: string;
    email: string;
  };
}

export class UserVerifiedListener extends Listener<UserVerifiedEvent> {
  readonly topic = 'user.verified' as const;
  queueGroupName = 'notification-service-welcome';
  private emailService: EmailService;

  constructor(emailService: EmailService) {
    super();
    this.emailService = emailService;
  }

  async onMessage(
    data: UserVerifiedEvent['data'],
    _msg: ConsumeMessage
  ): Promise<void> {
    try {
      logger.info(
        `User verified event received for: ${data.email}. Sending welcome email.`
      );

      await Promise.all([
        this.emailService.sendWelcomeEmail({
          email: data.email,
        }),

        NotificationService.createNotification({
          recipientId: data.userId,
          type: 'WELCOME',
          content:
            'Welcome to LearnSphere! Your account is now verified and ready to go.',
          linkUrl: '/dashboard',
        }),
      ]);
    } catch (err) {
      let error = err as Error;
      logger.error('Error handling user.verified event: %o', {
        userId: data.userId,
        error: error.message,
        stack: error.stack,
        name: error.name,
      });
    }
  }
}

interface InstructorApplicationSubmittedEvent {
  topic: 'instructor.application.submitted';
  data: {
    userId: string;
    userEmail: string;
    userName: string;
    applicationData: { expertise: string };
    submittedAt: string;
  };
}

export class InstructorApplicationSubmittedListener extends Listener<InstructorApplicationSubmittedEvent> {
  readonly topic: 'instructor.application.submitted' =
    'instructor.application.submitted' as const;
  queueGroupName: string = 'notification-service-admin-alerts';

  private emailService: EmailService;
  constructor(emailService: EmailService) {
    super();
    this.emailService = emailService;
  }

  async onMessage(
    data: {
      userEmail: string;
      userId: string;
      userName: string;
      applicationData: { expertise: string };
      submittedAt: string;
    },
    msg: ConsumeMessage
  ): Promise<void> {
    try {
      logger.info(`New instructor application submited by ${data.userName}`);

      const admins = await UserRepository.findAllAdmins();

      for (const admin of admins) {
        await NotificationService.createNotification({
          recipientId: admin.id,
          type: 'ADMIN_ALERT',
          content: `${data.userName} has applied to become an instructor in "${data.applicationData.expertise}".`,
          linkUrl: `/admin/users/${data.userId}`,
        });

        // await this.emailService.sendApplicationSubmittedAdminEmail({
        //   adminEmail: admin.email,
        //   userName: data.userName,
        //   expertise: data.applicationData.expertise,
        //   userId: data.userId,
        // });

        await NotificationService.createNotification({
          recipientId: data.userId,
          type: 'APPLICATION_STATUS',
          content:
            'Your instructor application has been submitted and is now under review.',
          linkUrl: '/settings/profile',
        });

        await this.emailService.sendApplicationSubmittedUserEmail({
          email: data.userEmail,
          userName: data.userName,
        });
      }
    } catch (error) {
      logger.error(`Error handling instructor.application.submitted event`, {
        data,
        error,
      });
    }
  }
}

interface InstructorApplicationDeclinedEvent {
  topic: 'instructor.application.declined';
  data: {
    userId: string;
    userEmail: string;
    userName: string;
    reason?: string;
  };
}

export class InstructorApplicationDeclinedListener extends Listener<InstructorApplicationDeclinedEvent> {
  readonly topic = 'instructor.application.declined' as const;
  queueGroupName = 'notification-service-user-alerts';

  private emailService: EmailService;
  constructor(emailService: EmailService) {
    super();
    this.emailService = emailService;
  }

  async onMessage(
    data: InstructorApplicationDeclinedEvent['data'],
    _msg: ConsumeMessage
  ): Promise<void> {
    try {
      logger.info(
        `Sending application declined notification to user ${data.userId}`
      );

      const user = await UserRepository.findById(data.userId);
      if (user) {
        await NotificationService.createNotification({
          recipientId: data.userId,
          type: 'APPLICATION_STATUS',
          content: `Unfortunately, your recent instructor application was not approved at this time.`,
          linkUrl: '/settings/profile',
        });

        await this.emailService.sendApplicationDeclinedEmail({
          email: user.email,
          userName: data.userName,
        });
      }
    } catch (error) {
      logger.error('Error handling instructor.application.declined event', {
        data,
        error,
      });
    }
  }
}

interface InstructorApplicationApprovedEvent {
  topic: 'instructor.application.approved';
  data: { userId: string; userEmail: string; userName: string };
}

export class InstructorApplicationApprovedListener extends Listener<InstructorApplicationApprovedEvent> {
  readonly topic = 'instructor.application.approved' as const;
  queueGroupName = 'notification-service-user-alerts';
  private emailService: EmailService;

  constructor(emailService: EmailService) {
    super();
    this.emailService = emailService;
  }

  async onMessage(
    data: InstructorApplicationApprovedEvent['data'],
    _msg: ConsumeMessage
  ) {
    logger.info(
      `Sending application approved notification to user ${data.userId}`
    );

    try {
      await NotificationService.createNotification({
        recipientId: data.userId,
        type: 'APPLICATION_STATUS',
        content:
          'Congratulations! Your instructor application has been approved.',
        linkUrl: '/dashboard/instructor',
      });

      await this.emailService.sendApplicationApprovedEmail({
        email: data.userEmail,
        userName: data.userName,
      });
    } catch (err) {
      let error = err as Error;
      logger.error('Error handling instructor.application.approved event: %o', {
        userId: data.userId,
        error: error.message,
        stack: error.stack,
        name: error.name,
      });
    }
  }
}

interface ReportGenerationSucceededEvent {
  topic: 'report.generation.succeeded';
  data: {
    jobId: string;
    requesterId: string;
    fileUrl: string;
    reportType: string;
    format: string;
  };
}

export class ReportGenerationSuccessListener extends Listener<ReportGenerationSucceededEvent> {
  readonly topic = 'report.generation.succeeded' as const;
  queueGroupName = 'notification-service-report-succeeded';
  private emailService: EmailService;

  constructor(emailService: EmailService) {
    super();
    this.emailService = emailService;
  }

  async onMessage(
    data: ReportGenerationSucceededEvent['data'],
    _msg: ConsumeMessage
  ) {
    try {
      logger.info(
        `Report generation succeeded for job ${data.jobId}. Notifying user ${data.requesterId}.`
      );

      const user = await UserRepository.findById(data.requesterId);
      if (!user) {
        logger.warn(
          `User ${data.requesterId} not found. Cannot send report notification.`
        );
        return;
      }

      await Promise.all([
        NotificationService.createNotification({
          recipientId: data.requesterId,
          type: 'REPORT_READY',
          content: `Your "${data.reportType.replace('_', ' ')}" report is ready for download.`,
          linkUrl: data.fileUrl,
        }),

        this.emailService.sendReportReadyEmail({
          email: user.email,
          userName: null,
          reportType: data.reportType,
          downloadUrl: data.fileUrl,
        }),
      ]);
    } catch (error) {
      logger.error('Failed to process report.generation.succeeded event', {
        data,
        error,
      });
    }
  }
}

interface ReportGenerationFailedEvent {
  topic: 'report.generation.failed';
  data: {
    jobId: string;
    requesterId: string;
    reason: string;
  };
}

export class ReportGenerationFailedListener extends Listener<ReportGenerationFailedEvent> {
  readonly topic = 'report.generation.failed' as const;
  queueGroupName = 'notification-service-report-failed';
  private emailService: EmailService;

  constructor(emailService: EmailService) {
    super();
    this.emailService = emailService;
  }

  async onMessage(
    data: ReportGenerationFailedEvent['data'],
    _msg: ConsumeMessage
  ) {
    try {
      logger.warn(
        `Report generation failed for job ${data.jobId}. Notifying user ${data.requesterId}.`
      );

      const user = await UserRepository.findById(data.requesterId);
      if (!user) {
        logger.warn(
          `User ${data.requesterId} not found. Cannot send report failure notification.`
        );
        return;
      }

      await Promise.all([
        NotificationService.createNotification({
          recipientId: data.requesterId,
          type: 'REPORT_FAILED',
          content: `We're sorry, but we were unable to generate your report. Reason: ${data.reason}`,
          linkUrl: '/dashboard/analytics?tab=reports',
        }),

        this.emailService.sendReportFailedEmail({
          email: user.email,
          userName: null,
          reportType: 'Student Performance',
          reason: data.reason,
        }),
      ]);
    } catch (error) {
      logger.error('Failed to process report.generation.failed event', {
        data,
        error,
      });
    }
  }
}

interface MessageSentEvent {
  topic: 'message.sent';
  data: {
    messageId: string;
    conversationId: string;
    senderId: string;
    senderName: string | null;
    recipientIds: string[];
    content: string;
    createdAt: string;
  };
}

export class MessageSentListener extends Listener<MessageSentEvent> {
  readonly topic = 'message.sent' as const;
  queueGroupName = 'notification-service-message-sent';

  async onMessage(data: MessageSentEvent['data'], _msg: ConsumeMessage) {
    try {
      logger.info(
        `Received message.sent event for conversation ${data.conversationId}`
      );

      const notificationsToCreate = data.recipientIds.map((recipientId) => ({
        recipientId,
        type: 'new_message',
        content: `You have a new message from ${data.senderName || 'a user'}.`,
        linkUrl: `/student/messages?conversationId=${data.conversationId}`,
        metadata: {
          messageId: data.messageId,
          senderId: data.senderId,
        },
      }));

      await NotificationService.createBatchNotifications(notificationsToCreate);

      logger.info(
        `Created ${notificationsToCreate.length} notifications for new message.`
      );
    } catch (error) {
      logger.error('Failed to process message.sent event', { data, error });
    }
  }
}

interface AIFeedbackReadyEvent {
  topic: 'ai.feedback.ready';
  data: {
    submissionId: string;
    studentId: string;
    courseId: string;
    assignmentTitle: string;
    courseTitle: string;
  };
}
export class AIFeedbackReadyListener extends Listener<AIFeedbackReadyEvent> {
  readonly topic: 'ai.feedback.ready' = 'ai.feedback.ready' as const;
  queueGroupName = 'ai-feedback.processing.queue';
  protected exchange = 'notification-processing.exchange';
  protected exchangeType = 'direct';
  private emailService: EmailService;

  constructor(emailService: EmailService) {
    super();
    this.emailService = emailService;
  }

  async onMessage(data: AIFeedbackReadyEvent['data'], _msg: ConsumeMessage) {
    try {
      logger.info(
        `Processing delayed AI feedback notification for submission ${data.submissionId}`
      );
      const user = await UserRepository.findById(data.studentId);
      if (!user)
        throw new Error(
          `User ${data.studentId} not found for feedback notification.`
        );

      const linkUrl = `/student/assignments?tab=submitted&highlight=${data.submissionId}`;

      await NotificationService.createNotification({
        recipientId: data.studentId,
        type: 'AI_FEEDBACK_READY',
        content: `Your AI feedback for an assignment is ready to view.`,
        linkUrl: linkUrl,
      });

      await this.emailService.sendFeedbackReadyEmail({
        email: user.email,
        userName: null,
        assignmentTitle: data.assignmentTitle,
        linkUrl: linkUrl,
      });

      const publisher = new AIFeedbackDeliveredPublisher();
      await publisher.publish({ submissionId: data.submissionId });
    } catch (error) {
      logger.error('Failed to process AI feedback ready event', {
        data,
        error,
      });
    }
  }
}
