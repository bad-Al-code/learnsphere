import { count, eq, sql } from 'drizzle-orm';
import { customAlphabet } from 'nanoid';

import { db } from '..';
import logger from '../../config/logger';
import { BadRequestError, ConflictError, NotFoundError } from '../../errors';
import { Waitlist, waitlist, WaitlistRoleEnum } from '../schema';

interface PostgresError extends Error {
  code?: string;
  detail?: string;
  constraint?: string;
  table?: string;
  schema?: string;
}

const generateReferralCode = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  8
);

export class WaitlistRepository {
  /**
   * Finds a waitlist entry by its referral code.
   * @param code The referral code to search for.
   * @returns The waitlist entry or undefined if not found.
   */
  public static async findByReferralCode(
    code: string
  ): Promise<Waitlist | undefined> {
    try {
      return await db.query.waitlist.findFirst({
        where: eq(waitlist.referralCode, code),
      });
    } catch (error) {
      logger.error('Error finding waitlist entry by referral code: %o', {
        code,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      return undefined;
    }
  }

  /**
   * Checks if an email already exists in the waitlist.
   * @param email The email address to check.
   * @returns True if the email exists, false otherwise.
   */
  public static async existsByEmail(email: string): Promise<boolean> {
    try {
      const [existing] = await db
        .select()
        .from(waitlist)
        .where(eq(waitlist.email, email))
        .limit(1);

      return !!existing;
    } catch (error) {
      logger.error('Error checking email existence in waitlist', {
        email,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw new Error('Failed to check email existence');
    }
  }

  /**
   * Creates a new entry in the waitlist table within a transaction.
   * Handles referral logic by finding the referrer and updating their count.
   * @param email The email address to add.
   * @param role The role of the user.
   * @param referredByCode An optional referral code.
   * @returns The newly created waitlist entry.
   */
  public static async create(
    email: string,
    role: WaitlistRoleEnum | undefined,
    referredByCode: string | null | undefined
  ): Promise<{ newEntry: Waitlist; referrer: Waitlist | null }> {
    return db.transaction(async (tx) => {
      let referrer: Waitlist | null = null;

      if (referredByCode) {
        const foundReferrer = await tx.query.waitlist.findFirst({
          where: eq(waitlist.referralCode, referredByCode),
        });

        if (foundReferrer) {
          if (foundReferrer.email === email) {
            logger.warn(`Self-Referral attempt blocked for email: ${email}`);

            throw new BadRequestError('You cannot refer yourself.');
          }

          referrer = foundReferrer;
          logger.debug(
            `Found referrer ${referrer.id} for code ${referredByCode}`
          );
        } else {
          logger.warn(
            `Referral code "${referredByCode}" was provided but not found in the database. Proceeding without a referrer.`
          );
        }
      }

      let newReferralCode: string;
      let isUnique = false;
      let attempts = 0;

      do {
        newReferralCode = generateReferralCode();
        const existing = await tx.query.waitlist.findFirst({
          where: eq(waitlist.referralCode, newReferralCode),
        });

        isUnique = !existing;
        attempts++;
      } while (!isUnique && attempts < 5);

      if (!isUnique) {
        logger.error(
          'Failed to generate a unique referral code after 5 attempts.'
        );

        throw new Error(
          'Failed to generate a unique referral code after 5 attempts.'
        );
      }

      let newEntry: Waitlist;
      try {
        [newEntry] = await tx
          .insert(waitlist)
          .values({
            email,
            role,
            referredById: referrer ? referrer.id : null,
            referralCode: newReferralCode,
          })
          .returning();
      } catch (error) {
        const pgError = error as PostgresError;
        if (pgError.code === '23505') {
          throw new ConflictError(
            'This email address is already on the waitlist.'
          );
        }

        logger.error('Database error during waitlist insertion: %o', {
          code: pgError.code,
          detail: pgError.detail,
          error: pgError.message,
        });

        throw new Error(
          'Could not add email to the waitlist due to a database error.'
        );
      }

      if (referrer) {
        const [updatedReferrer] = await tx
          .update(waitlist)
          .set({ referralCount: sql`${waitlist.referralCount} + 1` })
          .where(eq(waitlist.id, referrer.id))
          .returning();

        referrer = updatedReferrer;
        logger.debug(`Incremented referral count for user ${referrer.id}`);
      }

      return { newEntry, referrer };
    });
  }

  /**
   * Retrieves a waitlist entry by email.
   * @param email The email address to search for.
   * @returns The waitlist entry or null if not found.
   */
  public static async findByEmail(email: string): Promise<Waitlist | null> {
    try {
      const [entry] = await db
        .select()
        .from(waitlist)
        .where(eq(waitlist.email, email))
        .limit(1);

      return entry || null;
    } catch (error) {
      logger.error('Error finding waitlist entry by email: %o', {
        email,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw new Error('Failed to retrieve waitlist entry');
    }
  }

  /**
   * Retrieves the total count of waitlist entries.
   * @returns The count of entries.
   */
  public static async count(): Promise<number> {
    try {
      const [result] = await db.select({ count: count() }).from(waitlist);

      return Number(result?.count || 0);
    } catch (error) {
      logger.error('Error counting waitlist entries: %o', {
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
  public static async findAll(
    limit: number = 100,
    offset: number = 0
  ): Promise<Waitlist[]> {
    try {
      const entries = await db
        .select()
        .from(waitlist)
        .limit(limit)
        .offset(offset)
        .orderBy(waitlist.createdAt);

      return entries;
    } catch (error) {
      logger.error('Error retrieving waitlist entries: %o', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw new Error('Failed to retrieve waitlist entries');
    }
  }

  /**
   * Deletes a waitlist entry by email.
   * @param email The email address to delete.
   * @returns True if deleted, false if not found.
   */
  public static async deleteByEmail(email: string): Promise<boolean> {
    try {
      const [deleted] = await db
        .delete(waitlist)
        .where(eq(waitlist.email, email))
        .returning();

      return !!deleted;
    } catch (error) {
      logger.error('Error deleting waitlist entry: %o', {
        email,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      throw new Error('Failed to delete waitlist entry');
    }
  }

  /**
   * Appends a new reward identifier to a user's reward_unlocked array.
   * @param userId The ID of the user to grant the reward_unlocked array,
   * @param rewardId The identifier for the reward (e.g., '1_MONTH_FREE').
   * @returns The updated waitlist entry.
   */
  public static async addReward(
    userId: string,
    rewardId: string
  ): Promise<Waitlist> {
    try {
      const [updatedEntry] = await db
        .update(waitlist)
        .set({
          rewardsUnlocked: sql`array_append(${waitlist.rewardsUnlocked}, ${rewardId})`,
        })
        .where(eq(waitlist.id, userId))
        .returning();
      if (!updatedEntry) {
        throw new NotFoundError('Waitlist user not found for reward granting.');
      }

      return updatedEntry;
    } catch (error) {
      logger.error(
        `Database error while adding reward "${rewardId}" to user ${userId}`,
        { error }
      );

      throw new Error('Could not add reward due to a database error.');
    }
  }

  /**
   * Updates the interests for a waitlist entry identified by email.
   * @param email The email address of the user to update.
   * @param interests An array of interes strings.
   * @returns The updated waitlist entry
   */
  public static async updateInterests(
    email: string,
    interests: string[]
  ): Promise<Waitlist> {
    try {
      const [updatedEntry] = await db
        .update(waitlist)
        .set({ interests })
        .where(eq(waitlist.email, email))
        .returning();
      if (!updatedEntry) {
        throw new NotFoundError(
          'Could not update interests because the email was not found on the waitlist.'
        );
      }

      return updatedEntry;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      logger.error('Database error while updating interests: %o', {
        email,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw new Error('A database error occurred while updating interests.');
    }
  }
}
