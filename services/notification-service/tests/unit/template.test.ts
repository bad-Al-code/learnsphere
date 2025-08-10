import { faker } from '@faker-js/faker';
import { describe, expect, it } from 'vitest';

import { generatePasswordResetEmail } from '../../src/templates/password-reset.template';
import { generateVerificationEmail } from '../../src/templates/verification.template';

describe('Email Templates', () => {
  describe('generateVerificationEmail', () => {
    it('should include the correct verification link in the html', () => {
      const verificationLink = faker.internet.url();
      const verificationCode = faker.number
        .int({ min: 1_00_000, max: 9_99_999 })
        .toString();
      const html = generateVerificationEmail(
        verificationCode,
        verificationLink
      );

      expect(html).toContain(`href="${verificationLink}"`);
      expect(html).toContain('Verify Email Address');
    });
  });

  describe('generatePasswordResetEmail', () => {
    it('should include the correct password reset link in the html', () => {
      const resetLink = faker.internet.url();
      const resetCode = faker.number
        .int({ min: 1_00_000, max: 9_99_999 })
        .toString();
      const html = generatePasswordResetEmail(resetCode, resetLink);

      expect(html).toContain(`href="${resetLink}"`);
      expect(html).toContain('Reset Your Password');
    });
  });
});
