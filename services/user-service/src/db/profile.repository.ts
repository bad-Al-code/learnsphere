import { and, count, eq, ilike, inArray, or, sql } from 'drizzle-orm';

import { db } from '.';
import { profiles, UserSettings, UserStatus, userStatusEnum } from './schema';

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type UpdateProfile = Partial<
  Omit<Profile, 'userId' | 'createdAt' | 'updatedAt'>
>;

export class ProfileRepository {
  /**
   * Create a new user profile.
   * @param data The data for the new Profile.
   * @returns The newily created profile.
   */
  public static async create(data: NewProfile): Promise<Profile> {
    const [newProfile] = await db.insert(profiles).values(data).returning();

    return newProfile;
  }

  /**
   * Finds a profile by its userId. Returns all fields (private).
   * @param userId The ID of the user.
   * @returns The full profile object or undefined if not found.
   */
  public static async findPrivateById(
    userId: string
  ): Promise<Profile | undefined> {
    return db.query.profiles.findFirst({ where: eq(profiles.userId, userId) });
  }

  /**
   * Finds a profile by its userId, returning only public-facing fields.
   * @param userId The ID of the user.
   * @returns A public-safe profile object or undefined if not found.
   */
  public static async findPublicById(userId: string) {
    const [publicProfile] = await db
      .select({
        userId: profiles.userId,
        firstName: profiles.firstName,
        lastName: profiles.lastName,
        bio: profiles.bio,
        createdAt: profiles.createdAt,
        avatarUrls: profiles.avatarUrls,
        headline: profiles.headline,
      })
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);

    return publicProfile;
  }

  /**
   * Finds multiple public profiles by an array of userIds.
   * @param userIds An array of user IDs.
   * @returns An array of public-safe profile objects.
   */
  public static async findPublicByIds(userIds: string[]) {
    return db
      .select({
        userId: profiles.userId,
        firstName: profiles.firstName,
        lastName: profiles.lastName,
        avatarUrls: profiles.avatarUrls,
        headline: profiles.headline,
        dateOfBirth: profiles.dateOfBirth,
        lastKnownDevice: profiles.lastKnownDevice,
      })
      .from(profiles)
      .where(inArray(profiles.userId, userIds));
  }

  /**
   * Updates a profile by its userId.
   * @param userId The ID of the user to update.
   * @param data An object containing the fields to update.
   * @returns The updated profile object or null if not found.
   */
  public static async update(
    userId: string,
    data: UpdateProfile
  ): Promise<Profile | null> {
    const [updatedProfile] = await db
      .update(profiles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(profiles.userId, userId))
      .returning();

    return updatedProfile || null;
  }

  private static isValidUserStatus(status: string): status is UserStatus {
    return (userStatusEnum.enumValues as readonly string[]).includes(status);
  }

  /**
   * Searches for profiles by first or last name with pagination.
   * @param query The search query string.
   * @param page The current page number.
   * @param limit The number of results per page.
   * @param status An optional status to filter by.
   * @returns A paginated result object.
   */
  public static async search(
    query: string,
    page: number,
    limit: number,
    status?: string
  ) {
    const offset = (page - 1) * limit;
    const conditions = [];
    if (query) {
      conditions.push(
        or(
          ilike(profiles.firstName, `%${query}%`),
          ilike(profiles.lastName, `%${query}%`)
        )
      );
    }

    if (status && this.isValidUserStatus(status)) {
      conditions.push(eq(profiles.status, status));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const totalQuery = db
      .select({ value: count() })
      .from(profiles)
      .where(whereClause);

    const resultsQuery = db
      .select({
        userId: profiles.userId,
        firstName: profiles.firstName,
        lastName: profiles.lastName,
        avatarUrls: profiles.avatarUrls,
        headline: profiles.headline,
        status: profiles.status,
      })
      .from(profiles)
      .where(whereClause)
      .limit(limit)
      .offset(offset);

    const [[{ value: totalResults }], results] = await Promise.all([
      totalQuery,
      resultsQuery,
    ]);

    return { totalResults, results };
  }

  /**
   * Updates only the settings for a user.
   * @param userId The ID of the user.
   * @param settings The new settings object
   * @returns The full updated profile.
   */
  public static async updateSettins(
    userId: string,
    settings: UserSettings
  ): Promise<Profile | null> {
    const [updateProfile] = await db
      .update(profiles)
      .set({ settings, updatedAt: new Date() })
      .where(eq(profiles.userId, userId))
      .returning();

    return updateProfile || null;
  }

  /**
   * Adds a new FCM token to a user's profile.
   * Uses a SQL function to append to the array without duplicates.
   * @param userId The ID of the user.
   * @param token The new FCM token to add.
   */
  public static async addFcmToken(
    userId: string,
    token: string
  ): Promise<void> {
    await db.execute(sql`
      UPDATE "profiles"
      SET "fcm_tokens" = array_append("fcm_tokens", ${token})
      WHERE "user_id" = ${userId} AND NOT (${token} = ANY("fcm_tokens"))
    `);
  }

  /**
   * Removes an FCM token from a user's profile.
   * @param userId The ID of the user.
   * @param token The FCM token to remove.
   */
  public static async removeFcmToken(
    userId: string,
    token: string
  ): Promise<void> {
    await db.execute(sql`
      UPDATE "profiles"
      SET "fcm_tokens" = array_remove("fcm_tokens", ${token})
      WHERE "user_id" = ${userId}
    `);
  }

  /**
   * Retrieves application state statistics, including:
   * - Total number of users in the system
   * - Number of users with pending instructor applications
   *
   * @returns {Promise<{totalUsers: number; pendingApplications: number}>} An object containing user and application counts.
   */
  public static async getState(): Promise<{
    totalUsers: number;
    pendingApplications: number;
  }> {
    const totalUserQuery = db.select({ value: count() }).from(profiles);
    const pendingApplicationsQuery = db
      .select({ value: count() })
      .from(profiles)
      .where(eq(profiles.status, 'pending_instructor_review'));

    const [totalUsersResult, pendingApplicationsResult] = await Promise.all([
      totalUserQuery,
      pendingApplicationsQuery,
    ]);

    return {
      totalUsers: totalUsersResult[0].value,
      pendingApplications: pendingApplicationsResult[0].value,
    };
  }

  /**
Finds a single user by their email address, returning only public essentials.
@param email The user's email address.
@returns A simplified user object or undefined if not found.
*/
  public static async findPublicByEmail(
    email: string
  ): Promise<{ id: string } | undefined> {
    const [user] = await db
      .select({ id: profiles.userId })
      .from(profiles)
      .where(eq(profiles.email, email.toLowerCase()))
      .limit(1);

    return user;
  }

  /**
   * Searches for users by name or email, returning public-safe data.
   * @param query The search term.
   * @param limit The maximum number of results to return.
   * @returns An array of simplified user profile objects.
   */
  public static async searchUsers(query: string, limit: number) {
    return db
      .select({
        id: profiles.userId,
        name: sql<string>`CONCAT(${profiles.firstName}, ' ', ${profiles.lastName})`,
        email: profiles.email,
      })
      .from(profiles)
      .where(
        or(
          ilike(profiles.firstName, `%${query}%`),
          ilike(profiles.lastName, `%${query}%`),
          ilike(profiles.email, `%${query}%`)
        )
      )
      .limit(limit);
  }
}
