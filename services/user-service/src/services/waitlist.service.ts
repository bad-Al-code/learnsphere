import logger from '../config/logger';
import { WaitlistRepository } from '../db/repositories/waitlist.repository';
import { Waitlist, WaitlistRoleEnum } from '../db/schema';
import { BadRequestError, ConflictError, NotFoundError } from '../errors';
import {
  UserJoinedWaitlistPublisher,
  UserRewardUnlockedPublisher,
  WaitlistNurtureWeek1Publisher,
} from '../events/publisher';

const REWARD_TIERS = [
  { count: 3, id: '1_MONTH_FREE' },
  { count: 5, id: 'LIFETIME_DISCOUNT_25' },
  { count: 10, id: 'FOUNDING_MEMBER' },
];

export class WaitlistService {
  /**
   * Validates email format using regex.
   * @param email The email to validate.
   * @returns True if valid, false otherwise.
   */
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Checks if an email is from a disposable email provider.
   * @param email The email to check.
   * @returns True if disposable, false otherwise.
   */
  private static isDisposableEmail(email: string): boolean {
    const disposableDomains = [
      'tempmail.com',
      'throwaway.email',
      'guerrillamail.com',
      '10minutemail.com',
      'mailinator.com',
      'trashmail.com',
    ];

    const domain = email.split('@')[1]?.toLowerCase();
    return domain ? disposableDomains.includes(domain) : false;
  }

  /**
   * Adds a user's email to the waitlist with validation and referral handling.
   * @param email The email address to add.
   * @param referredByCode An optional referral code.
   * @param role The role of the user.
   * @returns The created waitlist entry.
   */
  public static async addToWaitlist(
    email: string,
    role: WaitlistRoleEnum | undefined,
    referredByCode: string | null | undefined
  ): Promise<Waitlist> {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      logger.warn('Attempted to add empty email to waitlist');

      throw new BadRequestError('Email address is required');
    }

    if (normalizedEmail.length > 255) {
      logger.warn('Attempted to add email that exceeds max length: %o', {
        emailLength: normalizedEmail.length,
      });

      throw new BadRequestError('Email address is too long');
    }

    if (!this.isValidEmail(normalizedEmail)) {
      logger.warn('Attempted to add invalid email format: %o', {
        email: normalizedEmail,
      });
      throw new BadRequestError('Invalid email format');
    }

    if (this.isDisposableEmail(normalizedEmail)) {
      logger.warn('Attempted to add disposable email to waitlist: %o', {
        email: normalizedEmail,
      });
      throw new BadRequestError('Disposable email addresses are not allowed');
    }

    logger.info(`Attempting to add email to waitlist: ${normalizedEmail}`);

    try {
      const exists = await WaitlistRepository.existsByEmail(normalizedEmail);

      if (exists) {
        logger.info(`Email already on waitlist: ${normalizedEmail}`);

        throw new ConflictError(
          'This email address is already on the waitlist.'
        );
      }

      const { newEntry, referrer } = await WaitlistRepository.create(
        normalizedEmail,
        role,
        referredByCode
      );

      logger.info(
        `Successfully added email to waitlist ${normalizedEmail}: %o`,
        {
          id: newEntry.id,
          role: newEntry.role,
          createdAt: newEntry.createdAt,
          referredBy: newEntry.referredById,
        }
      );

      try {
        const publisher = new UserJoinedWaitlistPublisher();
        await publisher.publish({
          email: newEntry.email,
          joinedAt: newEntry.createdAt,
        });
      } catch (eventError) {
        logger.error(
          `Failed to publish user.joined.waitlist event for ${newEntry.email}: %o`,
          {
            error: eventError,
          }
        );
      }

      try {
        const joinPublisher = new UserJoinedWaitlistPublisher();
        await joinPublisher.publish({
          email: newEntry.email,
          joinedAt: newEntry.createdAt,
        });
      } catch (eventError) {
        logger.error(
          `Failed to publish user.joined.waitlist event for ${newEntry.email}`,
          { error: eventError }
        );
      }

      try {
        const nurturePublisher = new WaitlistNurtureWeek1Publisher();
        const sevenDaysInMillis = 7 * 24 * 60 * 60 * 1000;
        await nurturePublisher.publish(
          {
            email: newEntry.email,
            joinedAt: newEntry.createdAt,
          },
          {
            expiration: sevenDaysInMillis.toString(),
          }
        );
      } catch (eventError) {
        logger.error(
          `Failed to publish DELAYED waitlist.nurture.week1 event for ${newEntry.email}`,
          { error: eventError }
        );
      }

      if (referrer) {
        await this.checkAndUnlockRewards(referrer);
      }

      return newEntry;
    } catch (error) {
      if (error instanceof ConflictError) {
        logger.info(`Email already on waitlist: ${normalizedEmail}`);

        throw error;
      } else if (error instanceof BadRequestError) {
        logger.warn(`Invalid email submission: ${normalizedEmail}`);

        throw error;
      } else {
        logger.error(`Failed to add email to waitlist ${normalizedEmail}: %o`, {
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
        });

        throw new Error(
          'Failed to add email to waitlist. Please try again later.'
        );
      }
    }
  }

  private static async checkAndUnlockRewards(
    referrer: Waitlist
  ): Promise<void> {
    const newCount = referrer.referralCount;
    const currentlyUnlocked = referrer.rewardsUnlocked || [];

    const newlyUnlockedTier = REWARD_TIERS.find(
      (tier) => tier.count === newCount && !currentlyUnlocked.includes(tier.id)
    );

    if (newlyUnlockedTier) {
      logger.info(
        `User ${referrer.id} has unlocked a new reward: ${newlyUnlockedTier.id}`
      );

      try {
        await WaitlistRepository.addReward(referrer.id, newlyUnlockedTier.id);

        const rewardPublisher = new UserRewardUnlockedPublisher();
        await rewardPublisher.publish({
          userId: referrer.id,
          email: referrer.email,
          rewardId: newlyUnlockedTier.id,
          referralCount: newCount,
          unlockedAt: new Date(),
        });
      } catch (error) {
        logger.error(
          `Failed to process reward unlocking for user ${referrer.id}: %o`,
          {
            rewardId: newlyUnlockedTier.id,
            error,
          }
        );
      }
    }
  }

  /**
   * Retrieves a waitlist entry by email.
   * @param email The email to search for.
   * @returns The waitlist entry or null.
   */
  public static async getByEmail(email: string): Promise<Waitlist | null> {
    const normalizedEmail = email.trim().toLowerCase();
    if (!this.isValidEmail(normalizedEmail)) {
      throw new BadRequestError('Invalid email format provided.');
    }

    logger.debug(`Fetching waitlist status for email: ${normalizedEmail}`);

    try {
      const entry = await WaitlistRepository.findByEmail(normalizedEmail);

      if (!entry) {
        throw new NotFoundError('Email not found on the waitlist.');
      }

      return entry;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof BadRequestError) {
        throw error;
      }

      logger.error(`Failed to retrieve waitlist entry ${normalizedEmail}: %o`, {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw new Error('Failed to retrieve waitlist entry');
    }
  }

  /**
   * Gets the total count of waitlist entries.
   * @returns The count.
   */
  public static async getCount(): Promise<number> {
    try {
      return await WaitlistRepository.count();
    } catch (error) {
      logger.error('Failed to get waitlist count: %o', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      return 0;
    }
  }

  /**
   * Retrieves all waitlist entries with pagination.
   * @param limit Maximum number of entries to retrieve.
   * @param offset Number of entries to skip.
   * @returns Array of waitlist entries.
   */
  public static async getAllEntries(
    limit: number = 100,
    offset: number = 0
  ): Promise<{ entries: Waitlist[]; total: number }> {
    try {
      const [entries, total] = await Promise.all([
        WaitlistRepository.findAll(limit, offset),
        WaitlistRepository.count(),
      ]);

      return { entries, total };
    } catch (error) {
      logger.error('Failed to get waitlist entries: %o', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw new Error('Failed to retrieve waitlist entries');
    }
  }

  /**
   * Removes an email from the waitlist.
   * @param email The email to remove.
   * @returns True if removed, false if not found.
   */
  public static async removeFromWaitlist(email: string): Promise<boolean> {
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const deleted = await WaitlistRepository.deleteByEmail(normalizedEmail);

      if (deleted) {
        logger.info(
          `Successfully removed email from waitlist: ${normalizedEmail}`
        );
      } else {
        logger.warn(`Email not found in waitlist: ${normalizedEmail}`);
      }

      return deleted;
    } catch (error) {
      logger.error(
        `Failed to remove email from waitlist ${normalizedEmail}: %o`,
        {
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      );

      throw new Error('Failed to remove email from waitlist');
    }
  }

  /**
   * Updates the interests for a user on the waitlist.
   * @param email The user's email
   * @param interests The array of interests to set
   * @returns The updated waitlist entry.
   */
  public static async updateInterests(
    email: string,
    interests: string[]
  ): Promise<Waitlist> {
    const normalizedEmail = email.trim().toLowerCase();
    logger.info(`Attempting to update interests for email: ${normalizedEmail}`);

    try {
      const updatedEntry = await WaitlistRepository.updateInterests(
        normalizedEmail,
        interests
      );

      logger.info(
        `Successfully updated interests for email ${normalizedEmail}: %o`,
        { interests: updatedEntry.interests }
      );

      return updatedEntry;
    } catch (error) {
      if (error instanceof NotFoundError) {
        logger.warn(
          `Attempted to update interests for non-existent email: ${normalizedEmail}`
        );
        throw error;
      }

      logger.error(
        `Unexpected error in WaitlistService while updating interests for ${normalizedEmail}: %o`,
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );

      throw new Error('An unexpected error occurred while updating interests.');
    }
  }
}
