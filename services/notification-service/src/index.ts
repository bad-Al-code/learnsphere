import http from 'node:http';

import { app } from './app';
import { EmailClient } from './clients/email.client';
import { env } from './config/env';
import logger from './config/logger';
import { rabbitMQConnection } from './events/connection';
import {
  AIFeedbackReadyListener,
  InstructorApplicationApprovedListener,
  InstructorApplicationDeclinedListener,
  InstructorApplicationSubmittedListener,
  MessageSentListener,
  ReportGenerationFailedListener,
  ReportGenerationSuccessListener,
  StudyRoomReminderListener,
  UserPasswordChangedListener,
  UserPasswordResetRequiredListener,
  UserSyncRegisteredListener,
  UserSyncRoleUpdatedListener,
  UserVerificationRequiredListener,
  UserVerifiedListener,
} from './events/listener';
import { EmailService } from './services/email-service';
import { WebSocketService } from './services/websocket.service';

const start = async () => {
  try {
    await rabbitMQConnection.connect();

    const emailClient = new EmailClient();
    const emailService = new EmailService(emailClient);

    new UserVerificationRequiredListener(emailService).listen();
    new UserPasswordResetRequiredListener(emailService).listen();
    new UserPasswordChangedListener(emailService).listen();
    new UserVerifiedListener(emailService).listen();
    new InstructorApplicationSubmittedListener(emailService).listen();
    new InstructorApplicationDeclinedListener(emailService).listen();
    new InstructorApplicationApprovedListener(emailService).listen();
    new UserSyncRegisteredListener().listen();
    new UserSyncRoleUpdatedListener().listen();
    new ReportGenerationSuccessListener(emailService).listen();
    new ReportGenerationFailedListener(emailService).listen();
    new MessageSentListener().listen();
    new AIFeedbackReadyListener(emailService).listen();
    new StudyRoomReminderListener().listen();

    const server = http.createServer(app);

    const webSocketService = new WebSocketService(server);
    webSocketService.start();

    server.listen(env.PORT, () => {
      logger.info(
        `Notification service (HTTP & WS) listening on port ${env.PORT}`
      );
    });
  } catch (error) {
    const err = error as Error;
    logger.error('Failed to start notification service: %o', {
      errMessage: err.message,
      errStack: err.stack,
      errName: err.name,
    });
    process.exit(1);
  }

  const shutdown = async () => {
    await rabbitMQConnection.close();
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

start();
