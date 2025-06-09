import { eq } from "drizzle-orm";
import logger from "../config/logger";
import { db } from "../db";
import { profiles } from "../db/schema";
import { NotFoundError } from "../errors";

interface NewProfileData {
  userId: string;
}

interface UpdateProfileData {
  firrtName?: string;
  lastName?: string;
  bio?: string;
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

  public static async getProfileById(userId: string) {
    logger.debug(`Fetching profile for user ID: ${userId}`);

    const profile = await db.query.profiles.findFirst({
      where: eq(profiles.userId, userId),
    });

    if (!profile) {
      logger.warn(`Profile not found for user ID: ${userId}`);
      return null;
    }

    return profile;
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
}
