import { describe, it, expect, beforeEach, vi } from 'vitest';
import { faker } from '@faker-js/faker';

import { EmailService } from '../../src/services/email-service';
import { UserVerificationRequiredListener } from '../../src/events/listener';
import { EmailClient } from '../../src/clients/email.client';

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
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await listener.onMessage(eventData, null as any);

    expect(mockEmailService.sendVerificationEmail).toHaveBeenCalledTimes(1);
    expect(mockEmailService.sendVerificationEmail).toHaveBeenCalledWith(
      eventData
    );
  });
});
