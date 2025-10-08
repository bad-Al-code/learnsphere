import { and, desc, eq, ilike, lt, sql } from 'drizzle-orm';

import { db } from '..';
import { NotFoundError } from '../../errors';
import { GetMentorshipProgramsQuery } from '../../schemas';
import {
  ApplicationStatusEnum,
  MentorshipApplication,
  mentorshipApplications,
  mentorshipFavorites,
  mentorshipPrograms,
  NewMentorshipApplication,
} from '../schema';

export class MentorshipRepository {
  /**
   * Finds mentorship programs based on the provided filters.
   * @param  filters - The filters to apply when fetching programs.
   * @returns  A list of mentorship programs matching the criteria.
   */
  public static async findPrograms(filters: GetMentorshipProgramsQuery) {
    const { query, status, isFree, isFavorite, limit, cursor, userId } =
      filters;

    const conditions = [];

    if (query && query.trim() !== '') {
      conditions.push(ilike(mentorshipPrograms.title, `%${query.trim()}%`));
    }

    if (status && status !== 'all') {
      conditions.push(eq(mentorshipPrograms.status, status));
    }

    if (isFree === true) {
      conditions.push(eq(mentorshipPrograms.price, 'Free'));
    }

    if (isFavorite === true && userId) {
      const favoriteProgramsSubquery = db
        .select({ programId: mentorshipFavorites.programId })
        .from(mentorshipFavorites)
        .where(eq(mentorshipFavorites.userId, userId));

      conditions.push(
        sql`${mentorshipPrograms.id} IN ${favoriteProgramsSubquery}`
      );
    }

    if (cursor) {
      const cursorProgram = await this.findProgramById(cursor);

      if (!cursorProgram) {
        throw new NotFoundError('Cursor program not found');
      }

      conditions.push(
        lt(mentorshipPrograms.createdAt, cursorProgram.createdAt)
      );
    }

    return db.query.mentorshipPrograms.findMany({
      where: conditions.length > 0 ? and(...conditions) : undefined,
      orderBy: [desc(mentorshipPrograms.createdAt)],
      limit: limit,
      with: {
        mentor: {
          columns: {
            name: true,
            // bio: true,
            role: true,
          },
        },
        favorites: {
          columns: {
            userId: true,
          },
        },
      },
    });
  }

  /**
   * Finds a mentorship program by its unique ID.
   * @param  programId - The unique ID of the mentorship program.
   * @returns  The mentorship program, or null if not found.
   */
  public static async findProgramById(programId: string) {
    const program = await db.query.mentorshipPrograms.findFirst({
      where: eq(mentorshipPrograms.id, programId),
    });

    return program || null;
  }

  /**
   * Checks whether a mentorship program exists by its ID.
   * @param  programId - The unique ID of the mentorship program.
   * @returns  True if the program exists, false otherwise.
   */
  public static async programExists(programId: string) {
    const program = await this.findProgramById(programId);
    return program !== null;
  }

  /**
   * Finds the mentorsip applicatio associated with a given user ID.
   * @param userId The unique identifier for the user
   * @returns A MentorshipApplication object if found, otherwise undefined.
   */
  public static async findApplicationByUserId(
    userId: string
  ): Promise<MentorshipApplication | undefined> {
    try {
      return await db.query.mentorshipApplications.findFirst({
        where: eq(mentorshipApplications.userId, userId),
      });
    } catch (error) {
      throw new Error(
        `Failed to fetch application for user ${userId}: ${error}`
      );
    }
  }

  /**
   * Creates a new mentorship application record in the database.
   * @param data The new Mentorship Application data.
   * @returns The newly created MentorshipApplication object.
   */
  public static async createApplication(
    data: NewMentorshipApplication
  ): Promise<MentorshipApplication> {
    const sanitizedData = {
      ...data,
      expertise: data.expertise.trim(),
      experience: data.experience.trim(),
      availability: data.availability.trim(),
    };

    try {
      const [newApplication] = await db
        .insert(mentorshipApplications)
        .values(sanitizedData)
        .returning();

      if (!newApplication) {
        throw new Error('Failed to create application - no data returned');
      }

      return newApplication;
    } catch (error) {
      throw new Error(`Failed to create mentorship application: ${error}`);
    }
  }

  /**
   * Checks if a user has any existing application (regardless status).
   * @param userId The unique identifier for the user.
   * @returns boolean indicating if application exists.
   */
  public static async hasExistingApplication(userId: string): Promise<boolean> {
    try {
      const application = await this.findApplicationByUserId(userId);

      return !!application;
    } catch (error) {
      throw new Error(`Failed to check existing application: ${error}`);
    }
  }

  /**
   * Gets the mentorship application status for a user.
   * @param userId The unique identifier for the user.
   * @returns Status information object.
   */
  public static async getApplicationStatus(userId: string): Promise<{
    id: string;
    status: ApplicationStatusEnum;
    createdAt: Date;
  } | null> {
    try {
      const application = await db.query.mentorshipApplications.findFirst({
        where: eq(mentorshipApplications.userId, userId),
        columns: {
          id: true,
          status: true,
          createdAt: true,
        },
      });

      return application || null;
    } catch (error) {
      throw new Error(
        `Failed to fetch application status for user ${userId}: ${error}`
      );
    }
  }
}
