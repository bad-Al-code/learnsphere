// services/auth-service/src/utils/crypto.ts
import crypto from 'node:crypto';

export class TokenUtil {
  /**
   * Hashes a given string token using SHA256.
   * @param {string} token - The raw token or code to hash.
   * @returns {string} The hex-encoded hash.
   */
  public static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Generates a random 6-digit numeric string.
   * @returns {string} A 6-digit code.
   */
  public static generateSixDigitCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Generates a long, secure random token for "magic link" fallbacks.
   * @returns {{ rawToken: string; hashedToken: string }}
   */
  public static generateSecureToken(): {
    rawToken: string;
    hashedToken: string;
  } {
    const rawToken = crypto.randomBytes(40).toString('hex');
    const hashedToken = this.hashToken(rawToken);
    return { rawToken, hashedToken };
  }

  /**
   * Generates a 6-digit code for user input.
   * @returns {{ rawCode: string; hashedCode: string }}
   */
  public static generateVerificationCode(): {
    rawCode: string;
    hashedCode: string;
  } {
    const rawCode = this.generateSixDigitCode();
    const hashedCode = this.hashToken(rawCode);
    return { rawCode, hashedCode };
  }

  /**
   * Calculates an expiration date from the current time.
   * @param {number} durationInMs - The duration in milliseconds.
   * @returns {Date} The future expiration date.
   */
  public static getExpirationDate(durationInMs: number): Date {
    return new Date(Date.now() + durationInMs);
  }
}
