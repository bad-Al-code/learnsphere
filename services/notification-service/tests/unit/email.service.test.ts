import { faker } from '@faker-js/faker';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EmailClient } from '../../src/clients/email.client';
import { EmailService } from '../../src/services/email-service';
import { generatePasswordResetEmail } from '../../src/templates/password-reset.template';
import { generateVerificationEmail } from '../../src/templates/verification.template';

vi.mock('../../src/clients/email.client');
vi.mock('../../src/templates/verification.template');
vi.mock('../../src/templates/password-reset.template');

describe('EmailService', () => {
  let emailService: EmailService;
  let mockEmailClient: EmailClient;

  beforeEach(() => {
    vi.clearAllMocks();

    mockEmailClient = new EmailClient();
    emailService = new EmailService(mockEmailClient);
  });

  describe('sendVerificationEmail', () => {
    it('should generate the correct HTML and call the email client with the right parameters', async () => {
      const testData = {
        email: faker.internet.email(),
        verificationToken: faker.string.uuid(),
        verificationCode: faker.number
          .int({ min: 1_00_000, max: 9_99_999 })
          .toString(),
      };

      const expectedLink = `http://localhost:3000/verify-email?token=${testData.verificationToken}&email=${testData.email}`;
      const mockHtmlBody = '<p>Mock HTML Body</p>';

      vi.mocked(generateVerificationEmail).mockReturnValue(mockHtmlBody);

      await emailService.sendVerificationEmail(testData);

      expect(generateVerificationEmail).toHaveBeenCalledWith(expectedLink);
      expect(mockEmailClient.send).toHaveBeenCalledTimes(1);
      expect(mockEmailClient.send).toHaveBeenCalledWith({
        to: testData.email,
        subject: 'Welcome to LearnSphere! Please Verify Your Email',
        text: expect.stringContaining(expectedLink),
        html: mockHtmlBody,
        type: 'verification',
      });
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('should generate the correct HTML and call the email client with the right parameters', async () => {
      const testData = {
        email: faker.internet.email(),
        resetToken: faker.string.uuid(),
        resetCode: faker.number
          .int({ min: 1_00_000, max: 9_99_999 })
          .toString(),
      };

      const resetLink = `http://localhost:3000/reset-password?token=${testData.resetToken}&email=${testData.email}`;
      const mockHtmlBody = '<p>Mock HTML Body</p>';

      vi.mocked(generatePasswordResetEmail).mockReturnValue(mockHtmlBody);

      await emailService.sendPasswordResetEmail(testData);

      expect(generatePasswordResetEmail).toHaveBeenCalledWith(resetLink);
      expect(mockEmailClient.send).toHaveBeenCalledTimes(1);
      expect(mockEmailClient.send).toHaveBeenCalledWith({
        to: testData.email,
        subject: 'LearnSphere Password Reset Request',
        text: expect.stringContaining(resetLink),
        html: mockHtmlBody,
        type: 'password_reset',
      });
    });
  });
});
