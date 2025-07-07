import { describe, beforeEach, it, expect } from 'vitest';
import { faker } from '@faker-js/faker';

import { db } from '../../src/db';
import { users } from '../../src/db/schema';
import { UserRepository } from '../../src/db/user.repository';

beforeEach(async () => {
  await db.delete(users);
});

describe('UserRepository', () => {
  describe('create()', () => {
    it('should create a new user and retur their essential details', async () => {
      const newUser = {
        email: faker.internet.email(),
        passwordHash: 'hashed_password_123',
      };

      const createdUser = await UserRepository.create(newUser);

      expect(createdUser).toBeDefined();
      expect(createdUser.id).toBeTypeOf('string');
      expect(createdUser.email).toBe(newUser.email);
      expect(createdUser.role).toBe('student');
    });
  });

  describe('findByEmail()', () => {
    it('should find an existing user by their email', async () => {
      const userEmail = faker.internet.email();
      await UserRepository.create({
        email: userEmail,
        passwordHash: 'some_hash',
      });

      const foundUser = await UserRepository.findByEmail(userEmail);

      expect(foundUser).toBeDefined();
      expect(foundUser?.email).toBe(userEmail);
    });

    it('should return undefined for a non-existent email', async () => {
      const foundUser = await UserRepository.findByEmail(
        'nonexistent@example.com'
      );

      expect(foundUser).toBeUndefined();
    });
  });

  describe('updateUser()', () => {
    it("should update a user's verification status", async () => {
      const userEmail = faker.internet.email();
      const createdUser = await UserRepository.create({
        email: userEmail,
        passwordHash: 'some_hash',
      });
      expect(createdUser.id).toBeDefined();

      await UserRepository.updateUser(createdUser.id, {
        isVerified: true,
      });

      const updatedUser = await UserRepository.findByEmail(userEmail);
      expect(updatedUser?.isVerified).toBe(true);
    });
  });
});
