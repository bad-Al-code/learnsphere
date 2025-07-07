import { eq } from "drizzle-orm";

import logger from "../config/logger";
import { db } from "../db";
import { users } from "../db/schema";
import { BadRequestError, UnauthenticatedError } from "../errors";
import { Password } from "../utils/password";
import { TokenUtil } from "../utils/crypto";
import { AuthService } from "../services/auth.service";

const TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000;
const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000;

export class AuthController {
  public static async singup(email: string, password: string) {
    const result = await AuthService.singup(email, password);

    return result;
  }

  public static async verifyEmail(email: string, verificationToken: string) {
    const hashedToken = TokenUtil.hashToken(verificationToken);

    const user = await db.query.users.findFirst({
      where: (users, { and, eq }) =>
        and(eq(users.email, email), eq(users.verificationToken, hashedToken)),
    });

    if (!user) {
      throw new UnauthenticatedError("Verification failed: Invalid token");
    }

    if (
      !user.verificationTokenExpiresAt ||
      Date.now() > user.verificationTokenExpiresAt.getTime()
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

    const { rawToken: resetToken, hashedToken } =
      TokenUtil.generateHashedToken();
    const passwordResetTokenExpiresAt = TokenUtil.getExpirationDate(
      FIFTEEN_MINUTES_IN_MS
    );

    await db
      .update(users)
      .set({
        passwordResetToken: hashedToken,
        passwordResetTokenExpiresAt,
      })
      .where(eq(users.id, user.id!));

    logger.info(`Password reset token generated for user: ${user.id}`);

    return { resetToken };
  }

  public static async resetPassword(
    email: string,
    resetToken: string,
    newPassword: string
  ) {
    const hashedToken = TokenUtil.hashToken(resetToken);

    const user = await db.query.users.findFirst({
      where: (users, { and, eq }) =>
        and(eq(users.email, email), eq(users.passwordResetToken, hashedToken)),
    });

    if (!user) {
      throw new UnauthenticatedError("Password reset failed: Invalid token.");
    }

    if (
      !user.passwordResetTokenExpiresAt ||
      Date.now() > user.passwordResetTokenExpiresAt.getTime()
    ) {
      throw new UnauthenticatedError(
        "Password reset failed: Token has expired"
      );
    }

    const newPasswordHash = await Password.toHash(newPassword);

    await db
      .update(users)
      .set({
        passwordHash: newPasswordHash,
        passwordResetToken: null,
        passwordResetTokenExpiresAt: null,
        passwordChangedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id!));

    logger.info(`Password succesfully reset for user ID: ${user.id}`);
  }

  public static async resendVerificationEmail(email: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    if (!user || user.isVerified) {
      if (user?.isVerified)
        logger.info(
          `Verification resend requested for already verified user: ${email}`
        );

      return null;
    }

    const { rawToken: verificationToken, hashedToken } =
      TokenUtil.generateHashedToken();
    const verificationTokenExpiresAt =
      TokenUtil.getExpirationDate(TWO_HOURS_IN_MS);

    await db
      .update(users)
      .set({
        verificationToken: hashedToken,
        verificationTokenExpiresAt,
      })
      .where(eq(users.id, user.id!));

    logger.info(`New verifiation token generated for user: ${user.id}`);

    return { user, verificationToken };
  }
}
