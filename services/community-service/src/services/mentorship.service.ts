import { MentorshipRepository } from '../db/repositories';
import { BadRequestError } from '../errors';
import { GetMentorshipProgramsQuery } from '../schemas';

export class MentorshipService {
  /**
   * Retrieves a list of mentorship programs based on provided filters.
   * @param  filters - The query filters (search, status, pagination, etc.).
   * @param  requesterId - Optional user ID, required when filtering by favorites.
   * @returns An object containing the formatted programs, next pagination cursor, and total count.
   *
   * @throws  If validation fails (e.g., missing requesterId for favorites or invalid limit).
   */
  public static async getPrograms(
    filters: GetMentorshipProgramsQuery,
    requesterId?: string
  ) {
    if (filters.isFavorite && !requesterId) {
      throw new BadRequestError([
        {
          message: 'Authentication required to filter by favorites',
          field: 'isFavorite',
        },
      ]);
    }

    if (filters.limit < 1 || filters.limit > 100) {
      throw new BadRequestError([
        {
          message: 'Limit must be between 1 and 100',
          field: 'limit',
        },
      ]);
    }

    const programs = await MentorshipRepository.findPrograms({
      ...filters,
      userId: requesterId,
    });

    let nextCursor: string | null = null;
    if (programs.length === filters.limit) {
      nextCursor = programs[programs.length - 1].id;
    }

    const formattedPrograms = programs.map((p) => ({
      id: p.id,
      title: p.title,
      mentorName: p.mentor.name,
      mentorInitials: p.mentor.name
        ?.split(' ')
        .map((n: string) => n[0])
        .join(''),
      mentorRole: 'Tech Lead', // Placeholder
      mentorBio: 'Experienced professional in the field.', // Placeholder
      rating: 4.8, // Placeholder
      reviews: 120, // Placeholder
      experience: 10, // Placeholder
      duration: p.duration,
      commitment: p.commitment,
      nextCohort: p.nextCohort,
      price: p.price,
      focusAreas: p.focusAreas,
      spotsFilled: 0, // Placeholder
      totalSpots: p.totalSpots,
      isFavorite: p.favorites.length > 0,
      likes: p.likes,
      status: p.status,
    }));

    return { programs: formattedPrograms, nextCursor, total: programs.length };
  }
}
