import {
  CourseRepository,
  LessonRepository,
  ModuleRepository,
} from '../db/repostiories';
import { ForbiddenError, NotFoundError } from '../errors';
import { Requester } from '../types';

export class AuthorizationService {
  /**
   * Checks if a user is the instructor of a given course.
   * Throws an error if the course is not found or if the user is not the owner.
   * @param courseId - The ID of the course to check.
   * @param requesterId - The ID of the user attempting the action.
   */
  public static async verifyCourseOwnership(
    courseId: string,
    requester: Requester
  ): Promise<void> {
    if (requester.role === 'admin') {
      return;
    }

    const course = await CourseRepository.findById(courseId);

    if (!course) {
      throw new NotFoundError('Course');
    }

    if (course.instructorId !== requester.id) {
      throw new ForbiddenError();
    }
  }

  /**
   * Checks if a user is the instructor of a course that a module belongs to.
   * Throws an error if the module is not found or if the user is not the owner of the parent course.
   * @param moduleId - The ID of the module to check.
   * @param requesterId - The ID of the user attempting the action.
   */
  public static async verifyModuleOwnership(
    moduleId: string,
    requester: Requester
  ): Promise<void> {
    if (requester.role === 'admin') {
      return;
    }

    const parentModule = await ModuleRepository.findById(moduleId);

    if (!parentModule) {
      throw new NotFoundError('Module');
    }

    if (parentModule.course.instructorId !== requester.id) {
      throw new ForbiddenError();
    }
  }

  /**
   * Checks if a user is the instructor of a course that a lesson belongs to.
   * Throws an error if the lesson is not found or if the user is not the owner.
   * @param lessonId - The ID of the lesson to check.
   * @param requesterId - The ID of the user attempting the action.
   */
  public static async verifyLessonOwnership(
    lessonId: string,
    requester: Requester
  ): Promise<void> {
    if (requester.role === 'admin') {
      return;
    }

    const lesson = await LessonRepository.findById(lessonId);

    if (!lesson) {
      throw new NotFoundError('Lesson');
    }

    if (lesson.module.course.instructorId !== requester.id) {
      throw new ForbiddenError();
    }
  }
}
