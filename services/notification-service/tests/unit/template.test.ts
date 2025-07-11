import { describe, expect, it } from 'vitest';
import { faker } from '@faker-js/faker';

import { generateVerificationEmail } from '../../src/templates/verification.template';
import { generatePasswordResetEmail } from '../../src/templates/password-reset.template';

describe('Email Templates', () => {
  describe('generateVerificationEmail', () => {
    it('should include the correct verification link in the html', () => {
      const verificationLink = faker.internet.url();
      const html = generateVerificationEmail(verificationLink);

      expect(html).toContain(`href="${verificationLink}"`);
      expect(html).toContain('Verify Email Address');
    });
  });

  describe('generatePasswordResetEmail', () => {
    it('should include the correct password reset link in the html', () => {
      const resetLink = faker.internet.url();
      const html = generatePasswordResetEmail(resetLink);

      expect(html).toContain(`href="${resetLink}"`);
      expect(html).toContain('Reset Your Password');
    });
  });
});
