import { AssignmentRepository, ModuleRepository } from '../db/repostiories';
import { NotFoundError } from '../errors';
import { CreateAssignmentDto, UpdateAssignmentDto } from '../schemas';
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
    const parentModule = await ModuleRepository.findById(moduleId);
    if (!parentModule) throw new NotFoundError('Module');

    await AuthorizationService.verifyCourseOwnership(
      parentModule.courseId,
      requester
    );

    const nextOrder = parentModule.assignments?.length || 0;

    const newAssignment = await AssignmentRepository.create({
      ...data,
      moduleId,
      courseId: parentModule.courseId,
      order: nextOrder,
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

    const updatedAssignment = await AssignmentRepository.update(
      assignmentId,
      data
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
}
