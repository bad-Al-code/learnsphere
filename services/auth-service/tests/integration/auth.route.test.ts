import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { faker } from "@faker-js/faker";

import { app } from "../../src/app";
import { db } from "../../src/db";
import { users } from "../../src/db/schema";

beforeEach(async () => {
  await db.delete(users);
});

describe("Auth Routes - Integration Tests", () => {
  describe("POST /api/auth/signup", () => {
    it("should create a new user, return 201, and set cookies", async () => {
      const userData = {
        email: faker.internet.email(),
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/signup")
        .send(userData)
        .expect(201);

      expect(response.body.message).toBe("Success");
      expect(response.body.user.email).toBe(userData.email);

      const cookies = response.headers["set-cookie"];
      expect(cookies).toBeDefined();
      expect(cookies?.some((cookie) => cookie.startsWith("token="))).toBe(true);
      expect(
        cookies?.some((cookie) => cookie.startsWith("refreshToken="))
      ).toBe(true);
    });

    it("should return 400 if email is already in use", async () => {
      const userData = {
        email: faker.internet.email(),
        password: "password123",
      };

      await request(app).post("/api/auth/signup").send(userData).expect(201);

      const response = await request(app)
        .post("/api/auth/signup")
        .send(userData)
        .expect(400);

      expect(response.body.errors[0].message).toBe("Email is already in use.");
    });

    it("should return 400 for invalid input (e.g., invalid email)", async () => {
      const userData = {
        email: "not-an-email",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/signup")
        .send(userData)
        .expect(400);

      expect(response.body.errors[0].field).toBe("body.email");
      expect(response.body.errors[0].message).toBe("Not a valid email");
    });
  });

  describe("GET /api/auth/test-auth (Protected Route)", () => {
    it("should return 401 Unauthorized if no token is provided", async () => {
      await request(app).get("/api/auth/test-auth").expect(401);
    });
  });
});
