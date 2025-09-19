import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { NotAuthorizedError } from '../errors';
import { findAssignmentsSchema } from '../schemas';
import { AssignmentService } from '../services';

export class AssignmentController {
  /**
   * @description Controller to create a new assignment.
   */
  public static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { moduleId } = req.params;
      const requester = req.currentUser;
      if (!requester) throw new NotAuthorizedError();

      const assignment = await AssignmentService.createAssignment(
        moduleId,
        req.body,
        requester
      );
      res.status(StatusCodes.CREATED).json(assignment);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @description Controller to update an existing assignment.
   */
  public static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { assignmentId } = req.params;
      const requester = req.currentUser;
      if (!requester) throw new NotAuthorizedError();

      const updatedAssignment = await AssignmentService.updateAssignment(
        assignmentId,
        req.body,
        requester
      );
      res.status(StatusCodes.OK).json(updatedAssignment);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @description Controller to delete an assignment.
   */
  public static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { assignmentId } = req.params;
      const requester = req.currentUser;
      if (!requester) throw new NotAuthorizedError();

      await AssignmentService.deleteAssignment(assignmentId, requester);
      res
        .status(StatusCodes.OK)
        .json({ message: 'Assignment deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @description Controller to reorder assignments.
   */
  public static async reorder(req: Request, res: Response, next: NextFunction) {
    try {
      const { moduleId, items } = req.body;
      const requester = req.currentUser;
      if (!requester) throw new NotAuthorizedError();

      await AssignmentService.reorderAssignments(moduleId, items, requester);
      res
        .status(StatusCodes.OK)
        .json({ message: 'Assignments reordered successfully' });
    } catch (error) {
      next(error);
    }
  }

  public static async getForCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;

      const queryParams = findAssignmentsSchema.parse({
        courseId,
        ...req.query,
      });

      const options = {
        ...queryParams,
        query: queryParams.q,
      };

      const result = await AssignmentService.getAssignmentsForCourse(options);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @description Controller to get assignment statuses for a course.
   */
  public static async getStatusesForCourse(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseId } = req.params;
      const statuses =
        await AssignmentService.getAssignmentStatusForCourse(courseId);
      res.status(StatusCodes.OK).json(statuses);
    } catch (error) {
      next(error);
    }
  }

  public static async getDueSoonCount(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cookie = req.headers.cookie;
      if (!cookie) throw new NotAuthorizedError();

      const result = await AssignmentService.getDueSoonCount(cookie);

      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
}
