import { and, asc, count, desc, eq, ilike, isNotNull, sql } from 'drizzle-orm';

import { db } from '..';
import { GetCertificatesQuery } from '../../schema';
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
}
