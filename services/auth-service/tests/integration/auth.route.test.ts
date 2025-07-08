import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { faker } from '@faker-js/faker';

import { app } from '../../src/app';
import { db } from '../../src/db';
import { auditLogs, users } from '../../src/db/schema';
import { and, eq } from 'drizzle-orm';

beforeEach(async () => {
  await db.delete(users);
});

describe('Auth Routes - Integration Tests', () => {
  describe('POST /api/auth/signup', () => {
    it('should create a new user, return 201, and set cookies', async () => {
      const userData = {
        email: faker.internet.email(),
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(201);

      expect(response.body.message).toBe('Success');
      expect(response.body.user.email).toBe(userData.email);

      let cookies: string[] = [];

      if (response.headers['set-cookie']) {
        const rawCookies = response.headers['set-cookie'];
        cookies = Array.isArray(rawCookies) ? rawCookies : [rawCookies];
      }

      expect(cookies.some((cookie) => cookie.startsWith('token='))).toBe(true);
      expect(cookies.some((cookie) => cookie.startsWith('refreshToken='))).toBe(
        true
      );

      const logs = await db.query.auditLogs.findMany({
        where: eq(auditLogs.userId, response.body.user.id),
      });

      expect(logs).toHaveLength(1);
      expect(logs[0].action).toBe('SIGNUP_SUCCESS');
    });

    it('should return 400 if email is already in use', async () => {
      const userData = {
        email: faker.internet.email(),
        password: 'password123',
      };

      await request(app).post('/api/auth/signup').send(userData).expect(201);

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(400);

      expect(response.body.errors[0].message).toBe('Email is already in use.');
    });

    it('should return 400 for invalid input (e.g., invalid email)', async () => {
      const userData = {
        email: 'not-an-email',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(400);

      expect(response.body.errors[0].field).toBe('body.email');
      expect(response.body.errors[0].message).toBe('Not a valid email');
    });
  });

  describe('GET /api/auth/test-auth (Protected Route)', () => {
    it('should return 401 Unauthorized if no token is provided', async () => {
      await request(app).get('/api/auth/test-auth').expect(401);
    });
  });

  describe('POST /api/auth/login', () => {
    const testUser = {
      email: faker.internet.email(),
      password: 'strong_password123',
    };

    let createdUser: { id: string; email: string; role: string };

    beforeEach(async () => {
      const signupResponse = await request(app)
        .post('/api/auth/signup')
        .send(testUser);
      createdUser = signupResponse.body.user;
    });
    it('should log in a user with correct credentials, return 200, and set cookies', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password })
        .expect(200);

      expect(response.body.user.email).toBe(testUser.email);

      let cookies: string[] = [];

      expect(cookies).toBeDefined();

      if (response.headers['set-cookie']) {
        const rawCookies = response.headers['set-cookie'];
        cookies = Array.isArray(rawCookies) ? rawCookies : [rawCookies];
      }

      expect(cookies.some((cookie) => cookie.startsWith('token='))).toBe(true);

      const logs = await db.query.auditLogs.findMany({
        where: eq(auditLogs.userId, response.body.user.id),
      });

      expect(logs).toHaveLength(1);
      expect(logs[0].action).toBe('LOGIN_SUCCESS');
      expect(logs[0].userId).toBe(response.body.user.id);
    });

    it('should return 400 for a correct email but incorrect password', async () => {
      await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrong_password',
        })
        .expect(400);

      const logs = await db.query.auditLogs.findMany({
        where: and(
          eq(auditLogs.userId, createdUser.id),
          eq(auditLogs.action, 'LOGIN_FAILURE')
        ),
      });

      expect(logs).toHaveLength(1);
      expect(logs[0].details).toEqual({
        email: testUser.email,
        reason: 'Incorrect password',
      });
    });
  });

  it('should return 400 for a non-existent email', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nobody@example.com',
        password: 'any_password',
      })
      .expect(400);

    expect(response.body.errors[0].message).toBe('Invalid credentials');
  });

  describe('PATCH /api/auth/update-password', () => {
    const testUser = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const newPassword = 'newPassword123';
    let authCookies: string[];

    beforeEach(async () => {
      await request(app).post('/api/auth/signup').send(testUser);

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send(testUser);

      const rawCookies = loginResponse.headers['set-cookie'];
      authCookies = Array.isArray(rawCookies) ? rawCookies : [rawCookies];
    });

    it('should return 401 Unauthorized if no auth cookie is provided', async () => {
      await request(app)
        .patch('/api/auth/update-password')
        .send({ currentPassword: testUser.password, newPassword: newPassword })
        .expect(401);
    });

    it('should update the password and return 200 OK if the correct cookie and passsword are provided', async () => {
      await request(app)
        .patch('/api/auth/update-password')
        .set('Cookie', authCookies)
        .send({ currentPassword: testUser.password, newPassword: newPassword })
        .expect(200);

      await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: newPassword })
        .expect(200);
    });

    it('should return 401 Unauthorized if the current password is incorrect', async () => {
      await request(app)
        .patch('/api/auth/update-password')
        .set('Cookie', authCookies)
        .send({ currentPassword: 'wrong-password', newPassword: newPassword })
        .expect(401);
    });
  });
});
