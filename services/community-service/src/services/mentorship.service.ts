import { UserClient } from '../clients/user.client';
import { MentorshipRepository } from '../db/repositories';
import { BadRequestError } from '../errors';
import { ConflictError } from '../errors/conflic-error';
import { BecomeMentorDto, GetMentorshipProgramsQuery } from '../schemas';
import { Requester } from '../types';

export class MentorshipService {
  /**
   * Retrieves a list of mentorship programs based on provided filters.
   * @param  filters - The query filters (search, status, pagination, etc.).
   * @param  requesterId - Optional user ID, required when filtering by favorites.
   * @returns An object containing the formatted programs, next pagination cursor, and total count.
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
    if (programs.length === 0) {
      return { programs: [], nextCursor: null, total: 0 };
    }

    const mentorIds = [...new Set(programs.map((p) => p.mentorId))];
    const mentorProfiles = await UserClient.getPublicProfiles(mentorIds);

    let nextCursor: string | null = null;
    if (programs.length === filters.limit) {
      nextCursor = programs[programs.length - 1].id;
    }

    const formattedPrograms = programs.map((p) => {
      const mentorProfile = mentorProfiles.get(p.mentorId);

      return {
        id: p.id,
        title: p.title,
        mentorName: p.mentor.name,
        mentorInitials: p.mentor.name
          ?.split(' ')
          .map((n: string) => n[0])
          .join(''),
        mentorRole: mentorProfile?.headline || 'Mentor',
        mentorBio: mentorProfile?.bio || 'An experienced professional.',
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
        isFavorite: requesterId
          ? p.favorites.some((f) => f.userId === requesterId)
          : false,
        likes: p.likes,
        status: p.status,
      };
    });

    return { programs: formattedPrograms, nextCursor, total: programs.length };
  }

  public static async applyToBeMentor(
    data: BecomeMentorDto,
    requester: Requester
  ) {
    const existingApplication =
      await MentorshipRepository.findApplicationByUserId(requester.id);
    if (existingApplication && existingApplication.status === 'pending')
      throw new ConflictError('You already have a pending application.');

    const newApplication = await MentorshipRepository.createApplication({
      userId: requester.id,
      ...data,
    });
  }
}
