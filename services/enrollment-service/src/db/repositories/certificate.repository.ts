import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  inArray,
  isNotNull,
  not,
  sql,
} from 'drizzle-orm';

import { db } from '..';
import { GetCertificatesQuery } from '../../schema';
import { Enrollment } from '../../types';
import { courses, enrollments } from '../schema';

export class CertificateRepository {
  /**
   * Fetches a paginated, filtered, and searched list of a user's certificates.
   * @param userId The ID of the user.
   * @param options The query options for filtering, searching, and pagination.
   * @returns An object containing the list of certificate data and the total count.
   */
  public static async findForUser(
    userId: string,
    options: GetCertificatesQuery
  ) {
    const { q, tag, sortBy, filter, page, limit } = options;
    const offset = (page - 1) * limit;

    const conditions = [
      eq(enrollments.userId, userId),
      eq(enrollments.status, 'completed'),
      isNotNull(enrollments.certificateId),
      eq(enrollments.isDeleted, false),
    ];

    if (q) {
      conditions.push(ilike(courses.title, `%${q}%`));
    }
    if (filter === 'favorites') {
      conditions.push(eq(enrollments.isFavorite, true));
    } else if (filter === 'archived') {
      conditions.push(eq(enrollments.isArchived, true));
    } else {
    }

    if (tag) {
      conditions.push(sql`${tag} = ANY(${enrollments.tags})`);
    }

    const whereClause = and(...conditions);

    const mainQuery = db
      .select({
        id: enrollments.id,
        courseId: enrollments.courseId,
        certificateId: enrollments.certificateId,
        certificateUrl: enrollments.certificateUrl,
        tags: enrollments.tags,
        isFavorite: enrollments.isFavorite,
        isArchived: enrollments.isArchived,
        notes: enrollments.notes,
        issueDate: enrollments.updatedAt,
        courseTitle: courses.title,
      })
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.courseId, courses.id))
      .where(whereClause);

    const totalQuery = db.select({ value: count() }).from(mainQuery.as('sub'));

    switch (sortBy) {
      case 'date-asc':
        mainQuery.orderBy(asc(enrollments.updatedAt));
        break;
      case 'title-asc':
        mainQuery.orderBy(asc(courses.title));
        break;
      case 'title-desc':
        mainQuery.orderBy(desc(courses.title));
        break;
      case 'date-desc':
      default:
        mainQuery.orderBy(desc(enrollments.updatedAt));
        break;
    }

    mainQuery.limit(limit).offset(offset);

    const [results, [{ value: totalResults }]] = await Promise.all([
      mainQuery,
      totalQuery,
    ]);

    return { totalResults, results };
  }

  /**
   * Toggles the 'isFavorite' status of a specific enrollment (certificate).
   * @param enrollmentId The id of the enrollment to update.
   * @returns The updated enrollment record.
   */
  public static async toggleFavorite(
    enrollmentId: string
  ): Promise<Enrollment> {
    const [updatedEnrollment] = await db
      .update(enrollments)
      .set({ isFavorite: not(enrollments.isFavorite), updatedAt: new Date() })
      .where(eq(enrollments.id, enrollmentId))
      .returning();

    return updatedEnrollment;
  }

  /**
   * Toggles the 'isArchived' status of a specific enrollment (certificate).
   * @param enrollmentId The ID of the enrollment to update.
   * @returns The updated enrollment record.
   */
  public static async toggleArchive(enrollmentId: string): Promise<Enrollment> {
    const [updatedEnrollment] = await db
      .update(enrollments)
      .set({
        isArchived: not(enrollments.isArchived),
        isFavorite: false,
        updatedAt: new Date(),
      })
      .where(eq(enrollments.id, enrollmentId))
      .returning();

    return updatedEnrollment;
  }

  /**
   * Updates the 'notes' for a specific enrollment (certificate).
   * @param enrollmentId The ID of the enrollment to update.
   * @param notes The new text content for the notes.
   * @returns The updated enrollment record.
   */
  public static async updateNotes(
    enrollmentId: string,
    notes: string
  ): Promise<Enrollment> {
    const [updatedEnrollment] = await db
      .update(enrollments)
      .set({ notes: notes, updatedAt: new Date() })
      .where(eq(enrollments.id, enrollmentId))
      .returning();

    return updatedEnrollment;
  }

  /**
   * Soft deletes a certificate by setting its 'isDeleted' flag to true.
   * @param enrollmentId The ID of the enrollment/certificate to delete.
   * @returns The updated enrollment record.
   */
  public static async softDelete(enrollmentId: string): Promise<Enrollment> {
    const [deletedEnrollment] = await db
      .update(enrollments)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(eq(enrollments.id, enrollmentId))
      .returning();

    return deletedEnrollment;
  }

  /**
   * Archives multiple certificates by setting 'isArchived' to true.
   * Also sets 'isFavorite' to false for the archived items.
   * @param enrollmentIds An array of enrollment IDs to archive.
   */
  public static async bulkArchive(enrollmentIds: string[]): Promise<void> {
    if (enrollmentIds.length === 0) return;
    await db
      .update(enrollments)
      .set({ isArchived: true, isFavorite: false, updatedAt: new Date() })
      .where(inArray(enrollments.id, enrollmentIds));
  }

  /**
   * Soft-deletes multiple certificates by setting 'isDeleted' to true.
   * @param enrollmentIds An array of enrollment IDs to soft-delete.
   */
  public static async bulkSoftDelete(enrollmentIds: string[]): Promise<void> {
    if (enrollmentIds.length === 0) return;
    await db
      .update(enrollments)
      .set({ isDeleted: true, updatedAt: new Date() })
      .where(inArray(enrollments.id, enrollmentIds));
  }

  /**
   * Finds user IDs for the given enrollment IDs.
   * @param enrollmentIds - Array of enrollment UUIDs to look up.
   * @returns A list of user IDs matching the provided enrollment IDs.
   */
  public static async findByIds(enrollmentIds: string[]): Promise<
    {
      userId: string;
    }[]
  > {
    return await db.query.enrollments.findMany({
      where: inArray(enrollments.id, enrollmentIds),
      columns: { userId: true },
    });
  }
}
