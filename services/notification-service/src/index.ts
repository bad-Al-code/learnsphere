import 'dotenv/config';

import logger from './config/logger';
import { rabbitMQConnection } from './events/connection';
import {
  UserPasswordChangedListener,
  UserPasswordResetRequiredListener,
  UserRegisteredWelcomeListener,
  UserVerificationRequiredListener,
} from './events/listener';
import { EmailClient } from './clients/email.client';
import { EmailService } from './services/email-service';

const start = async () => {
  try {
    await rabbitMQConnection.connect();

    const emailClient = new EmailClient();
    const emailService = new EmailService(emailClient);

    new UserVerificationRequiredListener(emailService).listen();
    new UserPasswordResetRequiredListener(emailService).listen();
    new UserRegisteredWelcomeListener(emailService).listen();
    new UserPasswordChangedListener(emailService).listen();

    logger.info(`Notification service is ready and listening for events`);
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
