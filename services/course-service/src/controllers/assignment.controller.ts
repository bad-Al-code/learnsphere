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
      const parseResult = findAssignmentsSchema.safeParse({
        courseId: req.params.courseId,
        q: req.query.q,
        status: req.query.status,
        moduleId: req.query.moduleId,
        page: req.query.page,
        limit: req.query.limit,
      });

      if (!parseResult.success) {
        res.status(StatusCodes.BAD_REQUEST).json({
          error: 'Invalid query parameters',
          details: parseResult.error.errors,
        });

        return;
      }

      const options = parseResult.data;

      const result = await AssignmentService.getAssignmentsForCourse(options);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
}
