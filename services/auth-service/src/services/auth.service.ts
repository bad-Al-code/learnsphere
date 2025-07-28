import crypto from 'node:crypto';

import axios from 'axios';
import { env } from '../config/env';
import logger from '../config/logger';
import { redisConnection } from '../config/redis';
import { User } from '../db/database.types';
import { UserRepository } from '../db/user.repository';
import { BadRequestError, UnauthenticatedError } from '../errors';
import {
  UserPasswordChangedPublisher,
  UserRegisteredPublisher,
  UserVerifiedPublisher,
} from '../events/publisher';
import { OauthProfile } from '../types/auth.types';
import { RequestContext } from '../types/service.types';
import { TokenUtil } from '../utils/crypto';
import { Password } from '../utils/password';
import { AuditService } from './audit.service';

const TWO_HOURS_IN_MS = 2 * 60 * 60 * 1000;
const FIFTEEN_MINUTES_IN_MS = 15 * 60 * 1000;
const TEN_MINUTES_IN_MS = 10 * 60 * 60 * 1000;
const RESEND_VERIFICATION_RATE_LIMIT_SECONDS = 60;

export class AuthService {
  /**
   * Finds a user by email. Private helper for this service.
   * @param email The user's email.
   * @returns A user object or undefined.
   */
  private static async _findUserByEmail(
    email: string
  ): Promise<User | undefined> {
    return UserRepository.findByEmail(email);
  }

  /**
   * Registers a new user.
   * @param email The new user's email.
   * @param password The new user's plain-text password.
   * @param [context={}]
   * @returns An object containing the new user and their raw verification token.
   * @throws {BadRequestError} If the email is already in use.
   */
  public static async signup(
    email: string,
    password: string,
    context: RequestContext = {}
  ) {
    logger.debug(`Checking if user exists with email: ${email}`);

    const existingUser = await this._findUserByEmail(email);

    if (existingUser) {
      logger.warn(`Signup attempt with existing email: ${email}`);

      throw new BadRequestError('Email is already in use.');
    }

    const { rawCode:verificationCode , hashedCode } = TokenUtil.generateVerificationCode();
    const { rawToken:verificationToken } =TokenUtil.generateSecureToken();
    const verificationTokenExpiresAt = TokenUtil.getExpirationDate(TEN_MINUTES_IN_MS);

    const passwordHash = await Password.toHash(password);

    const newUserRecord = {
      email,
      passwordHash,
      verificationToken: hashedCode,
      verificationTokenExpiresAt,
    };

    const newUser = await UserRepository.create(newUserRecord);

    logger.info(`User created successfully with ID: ${newUser.id}`);

    await AuditService.logEvent({
      action: 'SIGNUP_SUCCESS',
      userId: newUser.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
      details: { email: newUser.email },
    });

    return { user: newUser, verificationCode,  verificationToken };
  }

  /**
   * Authenticates a user with their email and password.
   * @param email The user's email.
   * @param password The user's plain-text password.
   * @returns The full user object if authentication is successful.
   * @throws {BadRequestError} If credentials are invalid.
   */
  public static async login(
    email: string,
    password: string,
    context: RequestContext = {}
  ) {
    logger.debug(`Login attempt for email: ${email}`);

    const existingUser = await this._findUserByEmail(email);

    if (!existingUser || !existingUser.passwordHash) {
      logger.warn(`Login failed: User not found for email ${email}`);

      await AuditService.logEvent({
        action: 'LOGIN_FAILURE',
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        details: { email, reason: 'User not found' },
      });

      throw new BadRequestError('Invalid credentials');
    }

    try {
      const userServiceUrl = env.USER_SERVICE_URL;
      const response = await axios.get<{ status: string }>(
        `${userServiceUrl}/api/users/${existingUser.id}`
      );

      if (response.data.status === 'suspended') {
        logger.warn(`Login attempt by suspended user: ${existingUser.id}`);

        await AuditService.logEvent({
          action: 'LOGIN_FAILURE',
          userId: existingUser.id,
          ipAddress: context.ipAddress,
          userAgent: context.userAgent,
          details: { email, reason: 'Account suspended' },
        });

        throw new UnauthenticatedError('Your account has been suspended.');
      }
    } catch (error) {
      logger.error(
        'Failed to contact user-service to check user status during login',
        { error }
      );

      throw new Error(
        'Could not verify account status. Please try again later.'
      );
    }

    const passwordMatch = await Password.compare(
      existingUser.passwordHash,
      password
    );

    if (!passwordMatch) {
      logger.warn(`Login failed: Invalid password for ${email}`);

      await AuditService.logEvent({
        action: 'LOGIN_FAILURE',
        userId: existingUser.id,
        ipAddress: context.ipAddress,
        userAgent: context.userAgent,
        details: { email, reason: 'Incorrect password' },
      });

      throw new BadRequestError('Invalid credentials');
    }

    await AuditService.logEvent({
      action: 'LOGIN_SUCCESS',
      userId: existingUser.id,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });

    return existingUser;
  }

  /**
   * Verifies a user's email using a token.
   * @param email The user's email.
   * @param verificationToken The raw verification token sent to the user.
   * @throws {UnauthenticatedError} If the token is invalid or expired.
   */
  public static async verifyEmail(email: string, verificationToken: string) {
    const hashedToken = TokenUtil.hashToken(verificationToken);

    const user = await UserRepository.findByEmailAndVerificationToken(
      email,
      hashedToken
    );
    if (!user) {
      throw new UnauthenticatedError('Verification failed: Invalid token');
    }

    if (
      !user.verificationTokenExpiresAt ||
      Date.now() > user.verificationTokenExpiresAt.getTime()
    ) {
      logger.warn(
        `Attempt to use expired or missing verification token for user: ${user.id}`
      );
      throw new UnauthenticatedError('Verification failed: Token has expired.');
    }

    logger.info(`Verifying email for user ID: ${user.id}`);

    await UserRepository.updateUser(user.id!, {
      isVerified: true,
      verificationToken: null,
      verificationTokenExpiresAt: null,
    });

    try {
      const publisher = new UserVerifiedPublisher();
      await publisher.publish({
        userId: user.id,
        email: user.email,
      });
    } catch (error) {
      logger.error('Failed to publish user.verified event', {
        userId: user.id,
        error,
      });
    }

    logger.info(`Email successfully verified for user ID: ${user.id}`);
  }

  /**
   * Initiates the password reset process for a user.
   * @param email The user's email.
   * @returns An object with the raw reset token, or null if the user doesn't exist.
   */
  public static async forgotPassword(email: string) {
    const user = await this._findUserByEmail(email);
    if (!user) {
      logger.warn(`Password reset requested for non-existent email: ${email}`);
      return null;
    }
const { rawCode: resetCode, hashedCode } = TokenUtil.generateVerificationCode();
    const { rawToken: resetToken} = TokenUtil.generateSecureToken();
    const passwordResetTokenExpiresAt = TokenUtil.getExpirationDate(
      TEN_MINUTES_IN_MS
    );

    await UserRepository.updateUser(user.id!, {
      passwordResetToken: hashedCode,
      passwordResetTokenExpiresAt,
    });

    logger.info(`Password reset token generated for user: ${user.id}`);

    return { resetCode, resetToken};
  }

  /**
   * Resets a user's password using a valid reset token.
   * @param email The user's email.
   * @param resetToken The raw password reset token.
   * @param newPassword The user's new plain-text password.
   * @throws {UnauthenticatedError} If the reset token is invalid or expired.
   */
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
      throw new UnauthenticatedError('Password reset failed: Invalid token.');
    }

    if (
      !user.passwordResetTokenExpiresAt ||
      Date.now() > user.passwordResetTokenExpiresAt.getTime()
    ) {
      throw new UnauthenticatedError(
        'Password reset failed: Token has expired'
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

    const publisher = new UserPasswordChangedPublisher();
    await publisher.publish({ userId: user.id, email: user.email });

    logger.info(`Password succesfully reset for user ID: ${user.id}`);
  }

  /**
   * Resends a verification email to an unverified user.
   * @param email The user's email.
   * @returns An object with the user and new token, or null if the user is already verified or doesn't exist.
   */
  public static async resendVerificationEmail(email: string) {
    const redisClient = redisConnection.getClient();
    const rateLimitKey = `resend-verification-lock:${email}`;

    const isLocked = await redisClient.get(rateLimitKey);
    if (isLocked) {
      throw new BadRequestError(
        'Please wait a minute before requesting another verification email.'
      );
    }

    const user = await this._findUserByEmail(email);
    if (!user || user.isVerified) {
      if (user?.isVerified)
        logger.info(
          `Verification resend requested for already verified user: ${email}`
        );

      return null;
    }

    const { rawCode: verificationToken, hashedCode } =
      TokenUtil.generateVerificationCode();
    const verificationTokenExpiresAt =
      TokenUtil.getExpirationDate(TWO_HOURS_IN_MS);

    await UserRepository.updateUser(user.id!, {
      verificationToken: hashedCode,
      verificationTokenExpiresAt,
    });

    await redisClient.set(rateLimitKey, 'locked', {
      EX: RESEND_VERIFICATION_RATE_LIMIT_SECONDS,
    });

    logger.info(`New verifiation token generated for user: ${user.id}`);

    return { user, verificationToken };
  }

  /**
   * Updates the password for an authenticated user.
   * @param userId The ID of the user updating their password
   * @param currentPassword The user's current plain-text password.
   * @param newPassword The user's new plain-text password
   * @param [context={}]
   * @throws {UnauthenticatedError} If the current password is incorrect.
   * @throws {BadRequestError} If the user is not found.
   */
  public static async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    context: RequestContext = {}
  ): Promise<void> {
    logger.debug(`Password update attempt for user ID: ${userId}`);

    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new BadRequestError('User Not Found');
    }

    if (!user.passwordHash) {
      throw new BadRequestError(
        'Cannot update password for an account created with a social provider.'
      );
    }

    const isPasswordCorrect = await Password.compare(
      user.passwordHash,
      currentPassword
    );
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError('Incorrect current password');
    }

    const newPasswordHash = await Password.toHash(newPassword);

    await UserRepository.updateUser(user.id!, {
      passwordHash: newPasswordHash,
      passwordChangedAt: new Date(),
    });

    logger.info(`Password successfully updated for user ID: ${userId}`);

    await AuditService.logEvent({
      action: 'PASSWORD_UPDATE_SUCCESS',
      userId: userId,
      ipAddress: context.ipAddress,
      userAgent: context.userAgent,
    });

    const publisher = new UserPasswordChangedPublisher();
    await publisher.publish({ userId: user.id, email: user.email });
  }

  /**
   * Finds an existing user by email or creates a new one for OAuth flows.
   * If a new user is created, their password field is null, and they are marked as verified.
   * @param email The email address provided ny tht OAuth Provier.
   * @returns The found or newly created user
   */
  public static async findOrCreateOauthUser(
    profile: OauthProfile
  ): Promise<User> {
    const { email, firstName, lastName, avatarUrl } = profile;

    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      logger.info(`Found existing user during OAuth flow for email: ${email}`);

      return existingUser;
    }

    logger.info(`Creating new user from OAuth provider for email: ${email}`);

    const tempPassword = `oauth-${crypto.randomBytes(16).toString('hex')}`;
    const passwordHash = await Password.toHash(tempPassword);

    const newUserRecord = await UserRepository.create({
      email,
      passwordHash,
      isVerified: true,
    });

    try {
      const publisher = new UserRegisteredPublisher();
      await publisher.publish({
        id: newUserRecord.id,
        email: newUserRecord.email,
        firstName: firstName,
        lastName: lastName,
        avatarUrl: avatarUrl,
      });
    } catch (error) {
      logger.error('Failed to publish user.registered event for OAuth user', {
        userId: newUserRecord.id,
        error,
      });
    }

    const fullUser = await UserRepository.findById(newUserRecord.id);
    if (!fullUser) {
      throw new Error('Failed to create OAuth user');
    }

    return fullUser;
  }

  /**
   * Updates a user's role. Called by an event listener when a role
   * change occurs in another service (e.g., user-service).
   * @param userId The ID of the user whose role is to be updated.
   * @param newRole The new role to assign to the user.
   */
  public static async updateUserRole(
    userId: string,
    newRole: 'student' | 'instructor' | 'admin'
  ): Promise<void> {
    const user = await UserRepository.findById(userId);

    if (!user) {
      logger.warn(
        `Received role update event for non-existent user: ${userId}`
      );
      return;
    }

    await UserRepository.updateUser(userId, { role: newRole });
  }
}
