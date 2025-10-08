import { UserClient } from '../clients/user.client';
import logger from '../config/logger';
import { MentorshipRepository, UserRepository } from '../db/repositories';
import { MentorshipApplication } from '../db/schema';
import { BadRequestError, NotFoundError } from '../errors';
import { ConflictError } from '../errors/conflic-error';
import { MentorApplicationSubmittedPublisher } from '../events/publisher';
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

  /**
   * Handles the process of applying to become a mentor.
   * @param data The mentor application data (expertise, motivation, etc.)
   * @param requester The currently authenticated user submitting the application.
   * @returns The newly created MentorshipApplication object
   */
  public static async applyToBeMentor(
    data: BecomeMentorDto,
    requester: Requester
  ): Promise<MentorshipApplication> {
    const userName = await UserRepository.getUsernameByUserId(requester.id);
    if (!userName) throw new NotFoundError('User');

    const existingApplication =
      await MentorshipRepository.findApplicationByUserId(requester.id);
    if (existingApplication) {
      switch (existingApplication.status) {
        case 'pending':
          throw new ConflictError(
            'You already have a pending application. Please wait for review.'
          );
        case 'approved':
          throw new ConflictError(
            'You area already an approved mentor. No need to reapply.'
          );
        case 'rejected':
          throw new ConflictError(
            'Your provious application was rejected. Please contact support befor reapplying.'
          );
        default:
          throw new ConflictError(
            'An application already exists for this user.'
          );
      }
    }

    let newApplication: MentorshipApplication;
    try {
      newApplication = await MentorshipRepository.createApplication({
        userId: requester.id,
        ...data,
      });
    } catch (error) {
      logger.error(
        `Failed to create mentorship application for user ${requester.id}:`,
        error
      );
      throw new BadRequestError(
        'Failed to submit application. Please try again.'
      );
    }

    try {
      const publisher = new MentorApplicationSubmittedPublisher();
      await publisher.publish({
        applicationId: newApplication.id,
        userId: requester.id,
        userName,
        expertise: newApplication.expertise,
      });
    } catch (error) {
      logger.error(
        'Failed to publish MentorApplicationSubmitted event:',
        error
      );
    }
    logger.info(
      `User ${requester.id} (${userName}) submitted a mentor application.`
    );

    return newApplication;
  }

  /**
   * Retrieves the mentorship application status for the current user.
   * @param requester The currently authenticated user
   * @returns Status object indicating if user has application and its status
   */
  public static async getMentorshipStatus(requester: Requester) {
    try {
      const applicationStatus = await MentorshipRepository.getApplicationStatus(
        requester.id
      );
      if (!applicationStatus) {
        logger.debug(
          `No mentorship application found for user ${requester.id}`
        );

        return {
          hasApplication: false,
        };
      }

      logger.debug(
        `Mentorship application status retrived for user ${requester.id}: ${applicationStatus.status}`
      );

      return {
        hasApplication: true,
        status: applicationStatus.status,
        applicationId: applicationStatus.id,
        submittedAt: applicationStatus.createdAt.toISOString(),
      };
    } catch (error) {
      logger.error(
        `Error fetching mentorship status for user ${requester.id}:`,
        error
      );
      throw new BadRequestError('Failed to retrieve mentorship status');
    }
  }
}
