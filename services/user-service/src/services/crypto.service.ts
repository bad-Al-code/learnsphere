import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

import { env } from '../config/env';
import logger from '../config/logger';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const KEY = Buffer.from(env.ENCRYPTION_KEY, 'hex');

export class CryptoService {
  /**
   * Encrypts a plaintext string using AES-256-GCM.
   * @param text The plaintext string to encrypt.
   * @returns A string in the format "iv:authTag:encryptedText"
   */
  public static encrypt(text: string): string {
    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(ALGORITHM, KEY, iv);
    const encrypted = Buffer.concat([
      cipher.update(text, 'utf8'),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
  }

  /**
   * Decrypts a string that was encrypted with the encrypt method.
   * @param encryptedText The string in "iv:authTag:encryptedText" format.
   * @returns The original plaintext string, or null if decryption fails.
   */
  public static decrypt(encryptedText: string | null): string | null {
    if (!encryptedText) {
      return null;
    }

    try {
      const parts = encryptedText.split(':');
      if (parts.length !== 3) {
        throw new Error('Invalid encrypted text format.');
      }

      const [ivHex, authTagHex, encryptedHex] = parts;
      const iv = Buffer.from(ivHex, 'hex');
      const authTag = Buffer.from(authTagHex, 'hex');
      const encrypted = Buffer.from(encryptedHex, 'hex');

      const decipher = createDecipheriv(ALGORITHM, KEY, iv);
      decipher.setAuthTag(authTag);
      const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
      ]);

      return decrypted.toString('utf8');
    } catch (error) {
      logger.error('Decryption failed:', error);

      return null;
    }
  }
}
