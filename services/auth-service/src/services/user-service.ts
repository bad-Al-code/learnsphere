import { eq } from "drizzle-orm";

import logger from "../config/logger";
import { db } from "../db";
import { users } from "../db/schema";
import { BadRequestError, UnauthenticatedError } from "../errors";
import { Password } from "../utils/password";
import crypto from "node:crypto";

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

    const verificationToken = crypto.randomBytes(40).toString("hex");
    const hashedVerificationToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");

    const twoHours = 2 * 60 * 60 * 1000;
    const verificationTokenExpiresAt = new Date(Date.now() + twoHours);

    const passwordHash = await Password.toHash(password);

    const newUser = await db
      .insert(users)
      .values({
        email,
        passwordHash,
        verificationToken: hashedVerificationToken,
        verificationTokenExpiresAt,
      })
      .returning({ id: users.id, email: users.email });

    logger.info(`User created successfully with ID: ${newUser[0].id}`);

    return { user: newUser[0], verificationToken };
  }

  public static async verifyEmail(email: string, verificationToken: string) {
    const hashedToken = crypto
      .createHash("sha256")
      .update(verificationToken)
      .digest("hex");
    const user = await db.query.users.findFirst({
      where: (users, { and, eq }) =>
        and(eq(users.email, email), eq(users.verificationToken, hashedToken)),
    });

    if (!user) {
      throw new UnauthenticatedError("Verification failed: Invalid token");
    }

    const now = Date.now();

    if (
      !user.verificationTokenExpiresAt ||
      now > user.verificationTokenExpiresAt.getTime()
    ) {
      logger.warn(
        `Attempt to use expired or missing verification token for user: ${user.id}`
      );
      throw new UnauthenticatedError("Verification failed: Token has expired.");
    }

    logger.info(`Verifying email for user ID: ${user.id}`);

    await db
      .update(users)
      .set({
        isVerified: true,
        verificationToken: null,
        verificationTokenExpiresAt: null,
      })
      .where(eq(users.id, user.id!));

    logger.info(`Email successfully verified for user ID: ${user.id}`);
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

    return existingUser;
  }

  public static async forgotPassword(email: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (!user) {
      logger.warn(`Password reset requested for non-existent email: ${email}`);
      return null;
    }

    const resetToken = crypto.randomBytes(40).toString("hex");
    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const fifteenMinutes = 15 * 60 * 1000;
    const passwordResetTokenExpiresAt = new Date(Date.now() + fifteenMinutes);

    await db
      .update(users)
      .set({
        passwordResetToken: hashedResetToken,
        passwordResetTokenExpiresAt,
      })
      .where(eq(users.id, user.id!));

    logger.info(`Password reset token generated for user: ${user.id}`);

    return { resetToken };
  }
}
