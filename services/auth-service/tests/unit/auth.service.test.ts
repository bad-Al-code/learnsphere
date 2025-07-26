import { beforeEach, describe, expect, it, vi } from 'vitest';
import { faker } from '@faker-js/faker';

import { db } from '../../src/db';
import { users } from '../../src/db/schema';
import { AuthService } from '../../src/services/auth.service';
import { UserRepository } from '../../src/db/user.repository';
import { BadRequestError, UnauthenticatedError } from '../../src/errors';
import { Password } from '../../src/utils/password';
import { UserRegisteredPublisher } from '../../src/events/publisher';

vi.mock('../../src/events/publisher', () => {
  const UserRegisteredPublisher = vi.fn();

  UserRegisteredPublisher.prototype.publish = vi.fn();
  return { UserRegisteredPublisher };
});

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

  describe('updatePassword', () => {
    let testUser: {
      id: string;
      email: string;
      password: string;
    };

    beforeEach(async () => {
      const password = faker.internet.password();
      const passwordHash = await Password.toHash(password);
      const created = await UserRepository.create({
        email: faker.internet.email(),
        passwordHash,
      });

      testUser = { ...created, password };
    });

    it('should update the password successfully with the correct current password', async () => {
      const newPassword = 'newPassword123';

      await AuthService.updatePassword(
        testUser.id,
        testUser.password,
        newPassword
      );

      const updatedUser = await UserRepository.findById(testUser.id);
      expect(updatedUser).toBeDefined();

      const isNewPasswordCorrect = await Password.compare(
        updatedUser!.passwordHash!,
        newPassword
      );
      expect(isNewPasswordCorrect).toBe(true);

      expect(updatedUser!.passwordChangedAt).not.toBeNull();
    });

    it('should throws an UnaunthenticatedError if the current password is incorrect', async () => {
      const newPassword = 'newPassword123';
      const wrongCurrentPassword = 'wrong-password';

      await expect(() =>
        AuthService.updatePassword(
          testUser.id,
          wrongCurrentPassword,
          newPassword
        )
      ).rejects.toThrow(new UnauthenticatedError('Incorrect current password'));
    });

    it('should throws a BadRequestError if the user ID does not exist', async () => {
      const nonExistentUserId = faker.string.uuid();

      await expect(() =>
        AuthService.updatePassword(
          nonExistentUserId,
          'any-password',
          'any-new-password'
        )
      ).rejects.toThrow(new BadRequestError('User Not Found'));
    });
  });
});

describe('findOrCreateOauthUser()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return an existing user if one is found by email', async () => {
    const existingUser = await UserRepository.create({
      email: 'existing.user@example.com',
      passwordHash: 'some-hash',
    });

    const oauthProfile = {
      email: 'existing.user@example.com',
      firstName: 'Existing',
      lastName: 'User',
    };

    const result = await AuthService.findOrCreateOauthUser(oauthProfile);

    expect(result.id).toBe(existingUser.id);
    expect(result.email).toBe(existingUser.email);

    expect(UserRegisteredPublisher.prototype.publish).not.toHaveBeenCalled();
  });

  it('should create a new user and publish an event if no user is found', async () => {
    const oauthProfile = {
      email: 'new.user@example.com',
      firstName: 'New',
      lastName: 'User',
      avatarUrl: 'http://example.com/avatar.jpg',
    };

    const newUser = await AuthService.findOrCreateOauthUser(oauthProfile);

    expect(newUser).toBeDefined();
    expect(newUser.email).toBe(oauthProfile.email);
    expect(newUser.isVerified).toBe(true);

    expect(UserRegisteredPublisher.prototype.publish).toHaveBeenCalledTimes(1);

    expect(UserRegisteredPublisher.prototype.publish).toHaveBeenCalledWith({
      id: newUser.id,
      email: oauthProfile.email,
      firstName: oauthProfile.firstName,
      lastName: oauthProfile.lastName,
      avatarUrl: oauthProfile.avatarUrl,
    });
  });
});
