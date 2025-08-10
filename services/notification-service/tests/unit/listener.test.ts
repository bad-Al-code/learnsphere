import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EmailClient } from '../../src/clients/email.client';
import {
  UserPasswordResetRequiredListener,
  UserVerificationRequiredListener,
} from '../../src/events/listener';
import { EmailService } from '../../src/services/email-service';

vi.mock('../../src/services/email-service');

describe('UserVerificationRequiredListener', () => {
  let mockEmailService: EmailService;
  let listener: UserVerificationRequiredListener;

  beforeEach(() => {
    vi.clearAllMocks();

    mockEmailService = new EmailService(new EmailClient());

    listener = new UserVerificationRequiredListener(mockEmailService);
  });

  it('should call emailService.sendVerificationEmail with the correct data from the message', async () => {
    const eventData = {
      email: faker.internet.email(),
      verificationToken: faker.string.uuid(),
      verificationCode: faker.number
        .int({ min: 1_00_000, max: 9_99_999 })
        .toString(),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await listener.onMessage(eventData, null as any);

    expect(mockEmailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
    expect(mockEmailService.sendVerificationEmail).toHaveBeenCalledWith(
      eventData
    );
  });
});

describe('UserPasswordResetRequiredListener', () => {
  let mockEmailService: EmailService;
  let listener: UserPasswordResetRequiredListener;

  beforeEach(() => {
    vi.clearAllMocks();

    mockEmailService = new EmailService(new EmailClient());

    listener = new UserPasswordResetRequiredListener(mockEmailService);
  });

  it('should call emailService.sendPasswordResetEmail with the correct data from the message', async () => {
    const eventData = {
      email: faker.internet.email(),
      resetToken: faker.string.uuid(),
      resetCode: faker.number.int({ min: 1_00_000, max: 9_99_999 }).toString(),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await listener.onMessage(eventData, null as any);

    expect(mockEmailService.sendPasswordResetEmail).toHaveBeenCalledTimes(1);
    expect(mockEmailService.sendPasswordResetEmail).toHaveBeenCalledWith(
      eventData
    );
  });
});
