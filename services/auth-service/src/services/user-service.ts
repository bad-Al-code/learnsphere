import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

import logger from "../config/logger";
import { db } from "../db";
import { users } from "../db/schema";
import { BadRequestError } from "../errors";
import { Password } from "../utils/password";

interface UserData {
  email: string;
  passwordHash: string;
}

export class UserService {
  public static async singup(email: string, password: string) {
    logger.debug(`Checking if user exists with email: ${email}`);

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      logger.warn(`Signup attempt with existing email: ${email}`);

      throw new BadRequestError("Email is already in use.");
    }

    const passwordHash = await Password.toHash(password);

    const newUser = await db
      .insert(users)
      .values({ email, passwordHash })
      .returning({ id: users.id, email: users.email });

    logger.info(`User created successfully with ID: ${newUser[0].id}`);

    return newUser[0];
  }

  public static async login(email: string, password: string) {
    logger.debug(`Login attempt for email: ${email}`);

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!existingUser) {
      logger.warn(`Login failed: User not found for email ${email}`);

      throw new BadRequestError("Invalid credentials");
    }

    const passwordMatch = await Password.compare(
      existingUser.passwordHash,
      password
    );

    if (!passwordMatch) {
      logger.warn(`Login failed: Invalid password for ${email}`);

      throw new BadRequestError("Invalid credentials");
    }

    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
    );

    logger.info(
      `User logged in successfully: ${email} (ID: ${existingUser.id})`
    );

    return {
      id: existingUser.id,
      email: existingUser.email,
      token: userJwt,
    };
  }
}
