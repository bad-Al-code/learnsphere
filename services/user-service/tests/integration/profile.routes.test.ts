import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { faker } from '@faker-js/faker';
import jwt from 'jsonwebtoken';

import { env } from '../../src/config/env';
import { app } from '../../src/app';
import { db } from '../../src/db';
import { profiles } from '../../src/db/schema';

const generateAuthCookie = (
  userId: string,
  role: 'student' | 'admin' = 'student'
) => {
  const payload = { id: userId, email: faker.internet.email(), role };
  const token = jwt.sign(payload, env.JWT_SECRET);
  return `token=${token}`;
};

beforeEach(async () => {
  await db.delete(profiles);
});

describe('Profile Routes - Integration Tests', () => {
  describe('GET /api/users/me', () => {
    it('should return 401 if user is not authenticated', async () => {
      await request(app).get('/api/users/me').expect(401);
    });

    it('should return the profile for an authenticated user', async () => {
      const userId = faker.string.uuid();
      await db.insert(profiles).values({ userId, firstName: 'Test' });
      const authCookie = generateAuthCookie(userId);

      const response = await request(app)
        .get('/api/users/me')
        .set('Cookie', authCookie)
        .expect(200);

      expect(response.body.userId).toBe(userId);
      expect(response.body.firstName).toBe('Test');
    });
  });

  describe('PUT /api/users/me', () => {
    it("should update the authenticated user's profile", async () => {
      const userId = faker.string.uuid();
      await db.insert(profiles).values({ userId, firstName: 'Initial' });
      const authCookie = generateAuthCookie(userId);

      const updateData = { firstName: 'Updated' };

      const response = await request(app)
        .put('/api/users/me')
        .set('Cookie', authCookie)
        .send(updateData)
        .expect(200);

      expect(response.body.firstName).toBe('Updated');
    });
  });
});
