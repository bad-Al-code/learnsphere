import { describe, it, expect, beforeEach, vi } from 'vitest';
import { faker } from '@faker-js/faker';

import { EmailService } from '../../src/services/email-service';
import { EmailClient } from '../../src/clients/email.client';
import { generateVerificationEmail } from '../../src/templates/verification.template';
import { generatePasswordResetEmail } from '../../src/templates/password-reset.template';

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
      };

      const expectedLink = `http://localhost:8000/verify-email?token=${testData.verificationToken}&email=${testData.email}`;
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
      });
    });
  });

  describe('sendPasswordResetEmail', () => {
    it('should generate the correct HTML and call the email client with the right parameters', async () => {
      const testData = {
        email: faker.internet.email(),
        resetToken: faker.string.uuid(),
      };

      const resetLink = `http://localhost:8000/reset-password?token=${testData.resetToken}&email=${testData.email}`;
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
      });
    });
  });
});
