import { eq } from "drizzle-orm";

import { db } from "../db";
import { User } from "../db/database.types";
import { userRoleEnum, users } from "../db/schema";
import logger from "../config/logger";
import { BadRequestError, UnauthenticatedError } from "../errors";
import { TokenUtil } from "../utils/crypto";
import { Password } from "../utils/password";
import { UserRepository } from "../db/user.repository";

const TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000;
const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000;

export class AuthService {
  private static async _findUserByEmail(
    email: string
  ): Promise<User | undefined> {
    return UserRepository.findByEmail(email);
  }

  public static async signup(email: string, password: string) {
    logger.debug(`Checking if user exists with email: ${email}`);

    const existingUser = await this._findUserByEmail(email);

    if (existingUser) {
      logger.warn(`Signup attempt with existing email: ${email}`);

      throw new BadRequestError("Email is already in use.");
    }

    const { rawToken: verificationToken, hashedToken } =
      TokenUtil.generateHashedToken();
    const verificationTokenExpiresAt =
      TokenUtil.getExpirationDate(TWO_HOURS_IN_MS);

    const passwordHash = await Password.toHash(password);

    const newUserRecord = {
      email,
      passwordHash,
      verificationToken: hashedToken,
      verificationTokenExpiresAt,
    };

    const newUser = await UserRepository.create(newUserRecord);

    logger.info(`User created successfully with ID: ${newUser.id}`);

    return { user: newUser, verificationToken };
  }

  public static async login(email: string, password: string) {
    logger.debug(`Login attempt for email: ${email}`);

    const existingUser = await this._findUserByEmail(email);

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

  public static async verifyEmail(email: string, verificationToken: string) {
    const hashedToken = TokenUtil.hashToken(verificationToken);

    const user = await UserRepository.findByEmailAndVerificationToken(
      email,
      hashedToken
    );
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

    await UserRepository.updateUser(user.id!, {
      isVerified: true,
      verificationToken: null,
      verificationTokenExpiresAt: null,
    });

    logger.info(`Email successfully verified for user ID: ${user.id}`);
  }

  public static async forgotPassword(email: string) {
    const user = await this._findUserByEmail(email);
    if (!user) {
      logger.warn(`Password reset requested for non-existent email: ${email}`);
      return null;
    }

    const { rawToken: resetToken, hashedToken } =
      TokenUtil.generateHashedToken();
    const passwordResetTokenExpiresAt = TokenUtil.getExpirationDate(
      FIFTEEN_MINUTES_IN_MS
    );

    await UserRepository.updateUser(user.id!, {
      passwordResetToken: hashedToken,
      passwordResetTokenExpiresAt,
    });

    logger.info(`Password reset token generated for user: ${user.id}`);

    return { resetToken };
  }

  public static async resetPassword(
    email: string,
    resetToken: string,
    newPassword: string
  ) {
    const hashedToken = TokenUtil.hashToken(resetToken);

    const user = await UserRepository.findByEmailAndPasswordResetToken(
      email,
      hashedToken
    );
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

    await UserRepository.updateUser(user.id!, {
      passwordHash: newPasswordHash,
      passwordResetToken: null,
      passwordResetTokenExpiresAt: null,
      passwordChangedAt: new Date(),
      updatedAt: new Date(),
    });

    logger.info(`Password succesfully reset for user ID: ${user.id}`);
  }

  public static async resendVerificationEmail(email: string) {
    const user = await this._findUserByEmail(email);
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

    await UserRepository.updateUser(user.id!, {
      verificationToken: hashedToken,
      verificationTokenExpiresAt,
    });

    logger.info(`New verifiation token generated for user: ${user.id}`);

    return { user, verificationToken };
  }
}
