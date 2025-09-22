import { EnrollmentClient } from '../clients/enrollment.client';
import logger from '../config/logger';
import { AssignmentRepository, ModuleRepository } from '../db/repostiories';
import { BadRequestError, NotFoundError } from '../errors';
import {
  assignmentSchema,
  CreateAssignmentDto,
  FindAssignmentsQuery,
  UpdateAssignmentDto,
  updateAssignmentSchema,
} from '../schemas';
import { Requester } from '../types';
import { AuthorizationService } from './authorization.service';
import { CourseCacheService } from './course-cache.service';

export class AssignmentService {
  /**
   * Creates a new assignment for a given module after verifying authorization.
   * @param {string} moduleId - The ID of the parent module.
   * @param {CreateAssignmentDto} data - The data for the new assignment.
   * @param {Requester} requester - The user making the request.
   * @returns {Promise<Assignment>} The newly created assignment.
   */
  public static async createAssignment(
    moduleId: string,
    data: CreateAssignmentDto,
    requester: Requester
  ) {
    const validatedData = assignmentSchema.parse(data);

    const parentModule = await ModuleRepository.findById(moduleId);
    if (!parentModule) throw new NotFoundError('Module');

    await AuthorizationService.verifyCourseOwnership(
      parentModule.courseId,
      requester
    );

    const nextOrder = parentModule.assignments?.length || 0;

    const newAssignment = await AssignmentRepository.create({
      title: validatedData.title,
      description: validatedData.description,
      dueDate: validatedData.dueDate,
      moduleId,
      courseId: parentModule.courseId,
      order: nextOrder,
      status: validatedData.status,
    });

    await CourseCacheService.invalidateCacheDetails(parentModule.courseId);

    return newAssignment;
  }

  /**
   * Updates an existing assignment after verifying authorization.
   * @param {string} assignmentId - The ID of the assignment to update.
   * @param {UpdateAssignmentDto} data - The new data for the assignment.
   * @param {Requester} requester - The user making the request.
   * @returns {Promise<Assignment>} The updated assignment.
   */
  public static async updateAssignment(
    assignmentId: string,
    data: UpdateAssignmentDto,
    requester: Requester
  ) {
    const assignment = await AssignmentRepository.findById(assignmentId);
    if (!assignment) throw new NotFoundError('Assignment');

    await AuthorizationService.verifyCourseOwnership(
      assignment.courseId,
      requester
    );

    const validatedData = updateAssignmentSchema.parse(data);

    if (Object.keys(validatedData).length === 0) {
      throw new BadRequestError('No valid fields provided for update.');
    }

    const updatedAssignment = await AssignmentRepository.update(
      assignmentId,
      validatedData
    );

    if (!updatedAssignment) throw new NotFoundError('Assignment');

    await CourseCacheService.invalidateCacheDetails(assignment.courseId);

    return updatedAssignment;
  }

  /**
   * Deletes an assignment after verifying authorization.
   * @param {string} assignmentId - The ID of the assignment to delete.
   * @param {Requester} requester - The user making the request.
   */
  public static async deleteAssignment(
    assignmentId: string,
    requester: Requester
  ): Promise<void> {
    const assignment = await AssignmentRepository.findById(assignmentId);
    if (!assignment) throw new NotFoundError('Assignment');

    await AuthorizationService.verifyCourseOwnership(
      assignment.courseId,
      requester
    );

    await AssignmentRepository.delete(assignmentId);
    await CourseCacheService.invalidateCacheDetails(assignment.courseId);
  }

  /**
   * Reorders assignments within a module after verifying authorization.
   * @param {string} moduleId - The ID of the module whose assignments are being reordered.
   * @param {object[]} items - An array of objects with `id` and `order`.
   * @param {Requester} requester - The user making the request.
   */
  public static async reorderAssignments(
    moduleId: string,
    items: { id: string; order: number }[],
    requester: Requester
  ): Promise<void> {
    const parentModule = await ModuleRepository.findById(moduleId);
    if (!parentModule) throw new NotFoundError('Module');

    await AuthorizationService.verifyCourseOwnership(
      parentModule.courseId,
      requester
    );

    await AssignmentRepository.reorder(items, moduleId);
    await CourseCacheService.invalidateCacheDetails(parentModule.courseId);
  }

  /**
   * Retrieves paginated and filtered assignments for a given course.
   *
   * @param {FindAssignmentsQuery} options - Filtering and pagination parameters.
   * @returns {Promise<{
   *   results: Assignment[],
   *   pagination: {
   *     currentPage: number,
   *     totalPages: number,
   *     totalResults: number
   *   }
   * }>} - Paginated assignments and metadata.
   */
  public static async getAssignmentsForCourse(options: FindAssignmentsQuery) {
    const { totalResults, results } =
      await AssignmentRepository.findAndFilter(options);

    const totalPages = Math.ceil(totalResults / options.limit);

    return {
      results,
      pagination: {
        currentPage: options.page,
        totalPages,
        totalResults,
      },
    };
  }

  /**
   * Retrieves the status and stats for all assignments in a given course
   * @param courseId The Course ID
   */
  public static async getAssignmentStatusForCourse(courseId: string) {
    logger.info(`Fetching assignment status for course ${courseId}`);

    return AssignmentRepository.getAssignmentStatusForCourse(courseId);
  }

  /**
   * Gets the count of assignments due soon for the current user.
   * @param cookie The user's cookie for authenticating with the enrollment service.
   * @returns The count of assignments due soon.
   */
  public static async getDueSoonCount(
    cookie: string
  ): Promise<{ count: number }> {
    const enrolledCourseIds =
      await EnrollmentClient.getEnrolledCourseIds(cookie);
    if (enrolledCourseIds.length === 0) {
      return { count: 0 };
    }

    const count =
      await AssignmentRepository.countDueSoonByCourseIds(enrolledCourseIds);

    return { count };
  }

  /**
   * Gets the count of pending assignments for the current user.
   * @param cookie The user's cookie for authenticating with the enrollment service.
   * @param userId The ID of the user.
   * @returns The count of pending assignments.
   */
  public static async getPendingCount(
    cookie: string,
    userId: string
  ): Promise<{ count: number }> {
    const enrolledCourseIds =
      await EnrollmentClient.getEnrolledCourseIds(cookie);
    if (enrolledCourseIds.length === 0) {
      return { count: 0 };
    }

    const count = await AssignmentRepository.countPendingForUser(
      enrolledCourseIds,
      userId
    );

    return { count };
  }

  /**
   * Get all pending assignments for a user across their enrolled courses.
   * @param {string} cookie - Authentication cookie to identify the user session.
   * @param {string} userId - ID of the user.
   * @param {Object} options - Optional query filters.
   * @param {string} [options.query] - Search query to filter assignment titles.
   * @param {'not-started'|'in-progress'} [options.status] - Status filter (client-side concept).
   * @returns {Promise<Array>} - Array of pending assignments for the user.
   */
  public static async getPendingAssignments(
    cookie: string,
    userId: string,
    options: {
      query?: string;
      type?: 'individual' | 'collaborative';
      status?: 'not-started' | 'in-progress';
    }
  ) {
    const enrolledCourseIds =
      await EnrollmentClient.getEnrolledCourseIds(cookie);
    if (enrolledCourseIds.length === 0) {
      return [];
    }

    return AssignmentRepository.findPendingForUser(
      enrolledCourseIds,
      userId,
      options
    );
  }

  /**
   * Mark an assignment as in-progress for a user by creating a draft.
   * @param {string} assignmentId - Assignment ID to start.
   * @param {Requester} requester - The user requesting the start.
   * @returns {Promise<void>} - Resolves when the draft is created and cache is invalidated.
   */
  public static async startAssignment(
    assignmentId: string,
    requester: Requester
  ) {
    const assignment = await AssignmentRepository.findById(assignmentId);
    if (!assignment) throw new NotFoundError('Assignment');

    // NOTE: CHECK for user enrollment as well

    await AssignmentRepository.createDraft(assignmentId, requester.id);
    await CourseCacheService.invalidateCacheDetails(assignment.courseId);
  }
}
