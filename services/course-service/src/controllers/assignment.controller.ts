import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { AssignmentRepository } from '../db/repostiories';
import { BadRequestError, NotAuthorizedError } from '../errors';
import {
  bulkAssignmentsByCoursesSchema,
  bulkAssignmentsSchema,
  draftStatusesSchema,
  findAssignmentsSchema,
  querySchema,
  requestReGradeParamsSchema,
  submissionIdParamsSchema,
} from '../schemas';
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
   * @description Controller to get multiple assignments by their IDs.
   */
  public static async getBulk(req: Request, res: Response, next: NextFunction) {
    try {
      const { assignmentIds } = bulkAssignmentsSchema.parse({ body: req.body })[
        'body'
      ];
      if (!Array.isArray(assignmentIds)) {
        throw new BadRequestError('assignmentIds must be an array.');
      }

      const assignments =
        await AssignmentService.getAssignmentsByIds(assignmentIds);

      res.status(StatusCodes.OK).json(assignments);
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

  public static async getMyPendingCount(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cookie = req.headers.cookie;
      const user = req.currentUser;
      if (!cookie || !user) throw new NotAuthorizedError();

      const result = await AssignmentService.getPendingCount(cookie, user.id);

      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  public static async getMyPending(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const cookie = req.headers.cookie;
      const user = req.currentUser;
      if (!cookie || !user) throw new NotAuthorizedError();
      const parseResult = querySchema.safeParse(req.query);
      if (!parseResult.success) {
        res.status(400).json({
          error: 'Invalid query parameters',
          details: parseResult.error.format(),
        });
        return;
      }
      const { q, status, type } = parseResult.data;

      const results = await AssignmentService.getPendingAssignments(
        cookie,
        user.id,
        {
          query: q,
          status,
          type,
        }
      );

      res.status(StatusCodes.OK).json(results);
    } catch (error) {
      next(error);
    }
  }

  public static async startAssignment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { assignmentId } = req.params;

      const requester = req.currentUser;
      if (!requester) throw new NotAuthorizedError();

      await AssignmentService.startAssignment(assignmentId, requester);

      res.status(StatusCodes.OK).json({
        message: 'Assignment marked as in-progress.',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getMyDraftStatuses(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = req.currentUser;
      if (!user) throw new NotAuthorizedError();

      const parseResult = draftStatusesSchema.safeParse(req.body);
      if (!parseResult.success) {
        res.status(400).json({
          error: 'Invalid request body',
          details: parseResult.error.format(),
        });

        return;
      }

      const { assignmentIds } = parseResult.data;

      const statuses = await AssignmentRepository.getDraftStatuses(
        user.id,
        assignmentIds
      );

      res.status(StatusCodes.OK).json(Array.from(statuses));
    } catch (error) {
      next(error);
    }
  }

  public static async getMySubmitted(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.currentUser) throw new NotAuthorizedError();

      const assignments = await AssignmentService.getSubmittedAssignments(
        req.currentUser.id
      );

      res.status(StatusCodes.OK).json(assignments);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @description Controller to get the content of a single submission.
   */
  public static async getSubmissionContent(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { submissionId } = submissionIdParamsSchema.parse({
        params: req.params,
      })['params'];
      const requester = req.currentUser;
      if (!requester) throw new NotAuthorizedError();

      const content = await AssignmentService.getSubmissionContent(
        submissionId,
        requester
      );

      res.status(StatusCodes.OK).json(content);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @description Controller to handle a re-grade request for a submission.
   */
  public static async requestReGrade(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { submissionId } = requestReGradeParamsSchema.parse({
        params: req.params,
      })['params'];

      const requester = req.currentUser;
      if (!requester) throw new NotAuthorizedError();

      await AssignmentService.requestReGrade(submissionId, requester);

      res
        .status(StatusCodes.OK)
        .json({ message: 'Re-grade request accepted.' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @description Controller to get multiple assignments for multiple courses by their IDs.
   */
  public static async getBulkByCourses(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { courseIds } = bulkAssignmentsByCoursesSchema.parse({
        body: req.body,
      })['body'];
      if (!Array.isArray(courseIds)) {
        throw new BadRequestError('courseIds must be an array.');
      }

      const assignments =
        await AssignmentService.getAssignmentsByCourseIds(courseIds);

      res.status(StatusCodes.OK).json(assignments);
    } catch (error) {
      next(error);
    }
  }
}
