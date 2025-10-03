import { and, desc, eq, ilike, lt, sql } from 'drizzle-orm';

import { db } from '..';
import { NotFoundError } from '../../errors';
import { GetMentorshipProgramsQuery } from '../../schemas';
import { mentorshipFavorites, mentorshipPrograms } from '../schema';

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
}
