import logger from '../config/logger';
import { BadRequestError, NotFoundError } from '../errors';
import {
  ProfileRepository,
  NewProfile,
  UpdateProfile,
  Profile,
} from '../db/profile.repository';
import { UserSettings } from '../db/schema';
import { UserRoleUpdatedPublisher } from '../events/publisher';

export class ProfileService {
  /**
   * Creates a new user profile.
   * @param data The data for the new profile.
   * @returns The newly created profile.
   */
  public static async createProfile(data: NewProfile): Promise<Profile> {
    logger.info(`Creating a new profile for user ID: ${data.userId}`);
    try {
      const newProfile = await ProfileRepository.create(data);
      logger.info(`Successfully created profile for user ID: ${data.userId}`);
      return newProfile;
    } catch (error) {
      logger.error('Error creating profile', { userId: data.userId, error });
      throw error;
    }
  }

  /**
   * Retrieves the full private profile for a user.
   * @param userId The ID of the user.
   * @returns The full profile object.
   * @throws {NotFoundError} If the profile is not found.
   */
  public static async getPrivateProfileById(userId: string): Promise<Profile> {
    logger.debug(`Fetching private profile for user ID: ${userId}`);
    const profile = await ProfileRepository.findPrivateById(userId);
    if (!profile) {
      throw new NotFoundError('Profile');
    }
    return profile;
  }

  /**
   * Retrieves the public-safe profile for a user.
   * @param userId The ID of the user.
   * @returns A public profile object.
   * @throws {NotFoundError} If the profile is not found.
   */
  public static async getPublicProfileById(userId: string) {
    logger.debug(`Fetching public profile for user ID: ${userId}`);
    const publicProfile = await ProfileRepository.findPublicById(userId);
    if (!publicProfile) {
      throw new NotFoundError('User Profile');
    }
    return publicProfile;
  }

  /**
   * Retrieves multiple public profiles by their IDs.
   * @param userIds An array of user IDs.
   * @returns An array of public profile objects.
   */
  public static async getPublicProfilesByIds(userIds: string[]) {
    logger.debug(
      `Fetching public profiles for ${userIds.length} users in bulk`
    );
    return ProfileRepository.findPublicByIds(userIds);
  }

  /**
   * Updates a user's profile.
   * @param userId The ID of the user whose profile is to be updated.
   * @param data The data to update.
   * @returns The updated profile object.
   * @throws {NotFoundError} If the profile to update is not found.
   */
  public static async updateProfile(
    userId: string,
    data: UpdateProfile
  ): Promise<Profile> {
    logger.info(`Updating profile for user ID: ${userId}`, { data });

    const updatedProfile = await ProfileRepository.update(userId, data);
    if (!updatedProfile) {
      logger.warn(
        `Attempted to update a profile that does not exist: ${userId}`
      );

      throw new NotFoundError('Profile');
    }

    return updatedProfile;
  }

  /**
   * Searches for user profiles.
   * @param query The search term.
   * @param page The page number for pagination.
   * @param limit The number of results per page.
   * @returns A paginated search result object.
   */
  public static async searchProfiles(
    query: string = '',
    page: number,
    limit: number
  ) {
    const { totalResults, results } = await ProfileRepository.search(
      query,
      page,
      limit
    );
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

  /**
   * Retrieves just the settings for a given user.
   * @param userId The ID of the user
   * @returns The user's settings object
   * @throws { NotFoundError } If the profile is not found.
   */
  public static async getSettings(userId: string): Promise<UserSettings> {
    const profile = await ProfileRepository.findPrivateById(userId);
    if (!profile) {
      throw new NotFoundError('Profile');
    }

    return profile.settings;
  }

  /**
   * Updates the settings for a given user.
   * @param userId The ID of the user.
   * @param newSettings The new settings object to apply.
   * @returns The updated settings object.
   * @throws {NotFoundError} If the profile is not found.
   */
  public static async updateSettings(
    userId: string,
    newSettings: Partial<UserSettings>
  ): Promise<UserSettings> {
    const currentSettings = await this.getSettings(userId);
    const mergedSettings = { ...currentSettings, ...newSettings };

    const updatedProfile = await ProfileRepository.updateSettins(
      userId,
      mergedSettings
    );
    if (!this.updateProfile) {
      throw new NotFoundError('Profile');
    }

    return updatedProfile!.settings;
  }

  /**
   * Allows a user to submit an application to become an instructor.
   * @param userId The ID of user applying.
   @throws { BadRequestError} If the user is already an instructor or has a pending application
   */
  public static async applyForInstructor(userId: string): Promise<void> {
    const profile = await this.getPrivateProfileById(userId);

    if (profile.status === 'pending_instructor_review') {
      throw new BadRequestError(`You already have a pending application.`);
    }

    await ProfileRepository.update(userId, {
      status: 'pending_instructor_review',
    });
    logger.info(`User ${userId} has applied to become an instructor`);
  }

  /**
   * [Admin] Approves a user's application to become an instructor.
   * @param userId The ID of the user to approve.
   * @returns The updated profile.
   * @throws { BadRequestError } If the user did not have a pending application.
   */
  public static async approveInstructor(userId: string): Promise<Profile> {
    const profile = await this.getPrivateProfileById(userId);

    if (profile.status !== 'pending_instructor_review') {
      throw new BadRequestError(
        'User does not have a pending instructor application'
      );
    }

    const updatedProfile = await ProfileRepository.update(userId, {
      status: 'active',
    });
    if (!this.updateProfile) {
      throw new NotFoundError('Profile');
    }

    const publisher = new UserRoleUpdatedPublisher();
    await publisher.publish({
      userId: userId,
      newRole: 'instructor',
    });

    return updatedProfile!;
  }
}
