import { EnrollmentClient } from '../clients/enrollment.client';
import { UserClient } from '../clients/user.client';
import { AssignmentRepository, DraftRepository } from '../db/repostiories';
import { Assignment, AssignmentDraft, NewAssignmentDraft } from '../db/schema';
import { BadRequestError, ForbiddenError, NotFoundError } from '../errors';
import { Requester } from '../types';

export class DraftService {
  /**
   * Verify that the requester owns the draft and is enrolled in the course.
   * @param draftId - ID of the draft to verify
   * @param requester - The user making the request
   * @throws {NotFoundError} If the draft or assignment doesn't exist
   * @throws {ForbiddenError} If the requester is not enrolled in the course
   */
  private static async verifyOwnership(
    draftId: string,
    requester: Requester
  ): Promise<{ draft: AssignmentDraft; assignment: Assignment }> {
    const draft = await DraftRepository.findById(draftId);
    if (!draft || draft.studentId !== requester.id) {
      throw new NotFoundError('Draft');
    }

    const assignment = await AssignmentRepository.findById(draft.assignmentId);
    if (!assignment) {
      throw new NotFoundError('Associated Assignment');
    }

    const isEnrolled = await EnrollmentClient.isEnrolled(
      requester.id,
      assignment.courseId
    );
    if (!isEnrolled) {
      throw new ForbiddenError();
    }

    return { draft, assignment };
  }

  /**
   * Retrieve all drafts for the requester.
   * @param requester - The user requesting drafts
   * @returns An array of drafts
   */
  public static async getDrafts(
    requester: Requester
  ): Promise<AssignmentDraft[]> {
    return DraftRepository.findByStudentId(requester.id);
  }

  /**
   * Create a new draft for a student if they are enrolled in the assignment's course.
   * @param data - Draft data to create
   * @param requester - The user creating the draft
   * @returns The newly created draft
   * @throws {NotFoundError} If the assignment does not exist
   * @throws {ForbiddenError} If the requester is not enrolled in the course
   */
  public static async createDraft(
    data: NewAssignmentDraft,
    requester: Requester
  ) {
    const assignment = await AssignmentRepository.findById(data.assignmentId);
    if (!assignment) throw new NotFoundError('Assignment');

    const isEnrolled = await EnrollmentClient.isEnrolled(
      requester.id,
      assignment.courseId
    );
    if (!isEnrolled) throw new ForbiddenError();

    const existingDraft = await DraftRepository.findByAssignmentAndStudent(
      data.assignmentId,
      requester.id
    );

    if (existingDraft) {
      return DraftRepository.update(existingDraft.id, data);
    }

    return DraftRepository.create({ ...data, studentId: requester.id });
  }

  /**
   * Update an existing draft if the requester owns it.
   * @param draftId - ID of the draft to update
   * @param data - Partial draft data for update
   * @param requester - The user making the update
   * @returns The updated draft
   */
  public static async update(
    draftId: string,
    data: Partial<NewAssignmentDraft>,
    requester: Requester
  ): Promise<NewAssignmentDraft> {
    await this.verifyOwnership(draftId, requester);

    return DraftRepository.update(draftId, data);
  }

  /**
   * Delete a draft if the requester owns it.
   * @param draftId - ID of the draft to delete
   * @param requester - The user making the deletion
   */
  public static async delete(
    draftId: string,
    requester: Requester
  ): Promise<void> {
    await this.verifyOwnership(draftId, requester);
    await DraftRepository.delete(draftId);
  }

  /**
   * Adds a collaborator to a draft by email.
   * @param draftId - The ID of the draft.
   * @param collaboratorEmail - The email of the collaborator to add.
   * @param requester - The user making the request.
   */
  public static async addCollaborator(
    draftId: string,
    collaboratorEmail: string,
    requester: Requester
  ) {
    await this.verifyOwnership(draftId, requester);

    const userToAdd = await UserClient.findUserByEmail(collaboratorEmail);
    if (!userToAdd) {
      throw new NotFoundError('User with that email not found.');
    }

    if (userToAdd.id === requester.id) {
      throw new BadRequestError('You cannot add yourself as a collaborator.');
    }

    const isAlreadyCollaborator = await DraftRepository.isUserCollaborator(
      draftId,
      userToAdd.id
    );
    if (isAlreadyCollaborator) {
      throw new BadRequestError(
        'User is already a collaborator on this draft.'
      );
    }

    await DraftRepository.addCollaborator(draftId, userToAdd.id);
  }

  /**
   *
   * @param draftId - The ID of the draft.
   * @param requester - The user making the request.
   * @returns An object containing the shareable link.
   */
  public static async generateShareLink(
    draftId: string,
    requester: Requester
  ): Promise<{
    shareLink: string;
  }> {
    await this.verifyOwnership(draftId, requester);

    const shareLink = `http://localhost:3000/student/assignments/drafts/${draftId}?shared=true`; // Placeholder

    return { shareLink };
  }
}
