import { eq, ilike, or, count } from "drizzle-orm";
import logger from "../config/logger";
import { db } from "../db";
import { profiles } from "../db/schema";
import { NotFoundError } from "../errors";

interface NewProfileData {
  userId: string;
}

interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatarUrl?: string;
}

export class ProfileService {
  public static async createProfile(data: NewProfileData) {
    logger.info(`Creating a new profile for user ID: ${data.userId}`);

    try {
      const newProfile = await db
        .insert(profiles)
        .values({
          userId: data.userId,
        })
        .returning();

      logger.info(`Successfully created profile for user ID: ${data.userId}`);

      return newProfile[0];
    } catch (error) {
      logger.error("Error creating profile in database", {
        userId: data.userId,
        error,
      });

      throw error;
    }
  }

  public static async getPrivateProfileById(userId: string) {
    logger.debug(`Fetching private profile for user ID: ${userId}`);
    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    });

    if (!profile) {
      throw new NotFoundError("Profile");
    }

    return profile;
  }

  public static async getProfileById(userId: string) {
    logger.debug(`Fetching public profile for user ID: ${userId}`);

    const publicProfile = await db
      .select({
        userId: profiles.userId,
        firstName: profiles.firstName,
        lastName: profiles.lastName,
        bio: profiles.bio,
        avatarUrl: profiles.avatarUrl,
        createdAt: profiles.createdAt,
      })
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    if (publicProfile.length === 0) {
      throw new NotFoundError("User Profile");
    }

    return publicProfile[0];
  }

  public static async updateProfile(userId: string, data: UpdateProfileData) {
    logger.info(`Updating profile for user ID: ${userId}`, { data });

    const updatedProfile = await db
      .update(profiles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(profiles.userId, userId))
      .returning();

    if (updatedProfile.length === 0) {
      logger.warn(
        `Attempted to update a profile that does not exist: ${userId}`
      );
      return null;
    }

    return updatedProfile[0];
  }

  public static async getPublicProfileById(userId: string) {
    logger.debug(`Fetching public profile for user ID: ${userId}`);

    const publicProfile = await db
      .select({
        userId: profiles.userId,
        firstName: profiles.firstName,
        lastName: profiles.lastName,
        bio: profiles.bio,
        createdAt: profiles.createdAt,
      })
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    if (publicProfile.length === 0) {
      throw new NotFoundError("User Profile");
    }

    return publicProfile[0];
  }

  public static async searchProfiles(
    query: string = "",
    page: number,
    limit: number
  ) {
    const offset = (page - 1) * limit;

    const whereClause = query
      ? or(
          ilike(profiles.firstName, `%${query}%`),
          ilike(profiles.lastName, `%${query}%`)
        )
      : undefined;

    const totalResultQuery = db
      .select({ value: count() })
      .from(profiles)
      .where(whereClause);

    const resultQuery = db
      .select({
        userId: profiles.userId,
        firstName: profiles.firstName,
        lastName: profiles.lastName,
        avatarUrl: profiles.avatarUrl,
        headline: profiles.headline,
      })
      .from(profiles)
      .where(whereClause)
      .offset(offset);

    const [total, results] = await Promise.all([totalResultQuery, resultQuery]);
    const totalResults = total[0].value;
    const totalPages = Math.ceil(totalResults / limit);

    return {
      results,
      pagination: {
        currentPage: page,
        totalPages,
        totalResults,
        limit,
      },
    };
  }
}
