import logger from "../config/logger";
import { db } from "../db";
import { profiles } from "../db/schema";

interface NewProfileData {
  userId: string;
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
}
