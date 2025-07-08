import { count, eq, ilike, inArray, or } from 'drizzle-orm';

import { db } from '.';
import { profiles } from './schema';

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

  /**
   * Searches for profiles by first or last name with pagination.
   * @param query The search query string.
   * @param page The current page number.
   * @param limit The number of results per page.
   * @returns A paginated result object.
   */
  public static async search(query: string, page: number, limit: number) {
    const offset = (page - 1) * limit;
    const whereClause = query
      ? or(
          ilike(profiles.firstName, `%${query}%`),
          ilike(profiles.lastName, `%${query}%`)
        )
      : undefined;

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
}
