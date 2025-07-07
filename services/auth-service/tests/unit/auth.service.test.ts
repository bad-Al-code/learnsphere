import { beforeEach, describe, expect, it } from 'vitest';
import { faker } from '@faker-js/faker';

import { db } from '../../src/db';
import { users } from '../../src/db/schema';
import { AuthService } from '../../src/services/auth.service';
import { UserRepository } from '../../src/db/user.repository';
import { BadRequestError } from '../../src/errors';
import { Password } from '../../src/utils/password';

beforeEach(async () => {
  await db.delete(users);
});

describe('AuthService', () => {
  describe('signup', () => {
    it('should create a new user successfully and return the user and a verification token', async () => {
      const userData = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const result = await AuthService.signup(
        userData.email,
        userData.password
      );

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('verificationToken');
      expect(result.user.email).toBe(userData.email);
      expect(result.verificationToken).toBeTypeOf('string');

      const dbUser = await UserRepository.findByEmail(userData.email);

      expect(dbUser).toBeDefined();
      expect(dbUser?.email).toBe(userData.email);
    });

    it('should throw a BadRequestError if the email is already in use', async () => {
      const existingUser = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await AuthService.signup(existingUser.email, existingUser.password);

      await expect(() =>
        AuthService.signup(existingUser.email, 'another_password')
      ).rejects.toThrow(new BadRequestError('Email is already in use.'));
    });
  });

  describe('login', () => {
    let testUser: { email: string; password: string };

    beforeEach(async () => {
      testUser = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const passwordHash = await Password.toHash(testUser.password);
      await UserRepository.create({
        email: testUser.email,
        passwordHash,
      });
    });

    it('should return the user object on successful login', async () => {
      const loggedInUser = await AuthService.login(
        testUser.email,
        testUser.password
      );

      expect(loggedInUser).toBeDefined();
      expect(loggedInUser.email).toBe(testUser.email);
    });

    it('should throw a BadRequestError for a non-existent user', async () => {
      await expect(() =>
        AuthService.login('nonexistent@user.com', 'some_password')
      ).rejects.toThrow(new BadRequestError('Invalid credentials'));
    });

    it('should throw a BadRequestError for an incorrect password', async () => {
      await expect(() =>
        AuthService.login(testUser.email, 'wrong_password')
      ).rejects.toThrow(new BadRequestError('Invalid credentials'));
    });
  });
});
