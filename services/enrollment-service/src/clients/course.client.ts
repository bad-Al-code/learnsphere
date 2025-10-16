import axios from 'axios';

import { env } from '../config/env';
import logger from '../config/logger';

interface CourseInfo {
  id: string;
  title: string;
  category: {
    id: string;
    name: string;
  } | null;
}

export class CourseClient {
  private static courseServiceUrl = env.COURSE_SERVICE_URL;
  /**
   * Fetches basic details for multiple courses.
   * @param courseIds An array of course IDs.
   * @returns A Map of courseId to course details.
   */
  public static async getCoursesByIds(
    courseIds: string[]
  ): Promise<Map<string, CourseInfo>> {
    const courseMap = new Map<string, CourseInfo>();
    if (courseIds.length === 0) return courseMap;

    try {
      const response = await axios.post<CourseInfo[]>(
        `${this.courseServiceUrl}/api/courses/bulk`,
        { courseIds }
      );

      response.data.forEach((course) => courseMap.set(course.id, course));
    } catch (error) {
      logger.error('Failed to bulk fetch course details: %o', { error });
    }

    return courseMap;
  }

  /**
   * Fetches the count of pending assignments for a user by forwarding their cookie.
   * @param cookie The user's authentication cookie header.
   * @returns The count of pending assignments.
   */
  public static async getPendingAssignmentsCount(
    cookie: string
  ): Promise<number> {
    try {
      const response = await axios.get<{ count: number }>(
        `${this.courseServiceUrl}/api/assignments/my-pending-count`,
        { headers: { Cookie: cookie } }
      );

      return response.data.count;
    } catch (error) {
      logger.error('Failed to fetch pending assignments count', { error });
      return 0;
    }
  }

  /**
   * Get the user's pending assignments.
   * @param {string} cookie - User authentication cookie.
   * @returns {Promise<{ title: string; course: string; dueDate: string | null }[]>} Array of pending assignments.
   */
  public static async getPendingAssignments(
    cookie: string
  ): Promise<{ title: string; course: string; dueDate: string | null }[]> {
    try {
      const response = await axios.get<
        { title: string; course: string; dueDate: string | null }[]
      >(`${this.courseServiceUrl}/api/assignments/my-pending`, {
        headers: { Cookie: cookie },
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to fetch pending assignments from course-service', {
        error,
      });
      return [];
    }
  }

  /**
   * Fetches all assignments for a given course.
   * @param courseId The ID of the course.
   * @returns An array of assignment objects.
   */
  public static async getAssignmentsForCourse(
    courseId: string
  ): Promise<{ id: string; dueDate: Date | null }[]> {
    try {
      const response = await axios.get<{
        results: { id: string; dueDate: string | null }[];
      }>(`${this.courseServiceUrl}/api/courses/${courseId}/assignments`, {
        params: { limit: 1000 },
      });

      return response.data.results.map((a) => ({
        ...a,
        dueDate: a.dueDate ? new Date(a.dueDate) : null,
      }));
    } catch (error) {
      logger.error(
        `Failed to fetch assignments for course ${courseId} from course-service`,
        { error }
      );
      return [];
    }
  }

  /**
   * Fetches details for multiple assingments by their Ids from the course-service.
   * @param assignmentIds An array of assingment IDs.
   * @returns A map where the key is the assingment Id and the value is tje assignment title.
   */
  public static async getAssignmentsByIds(
    assignmentIds: string[]
  ): Promise<Map<string, { title: string }>> {
    const assingmentMap = new Map<string, { title: string }>();
    if (assignmentIds.length === 0) return assingmentMap;

    try {
      const response = await axios.post<{ id: string; title: string }[]>(
        `${this.courseServiceUrl}/api/assignments/bulk`,
        { assignmentIds },
        {
          headers: {
            'x-internal-api-key': env.INTERNAL_API_KEY,
          },
        }
      );

      response.data.forEach((assingment) =>
        assingmentMap.set(assingment.id, { title: assingment.title })
      );
    } catch (error) {
      logger.error('Failed to bulk fetch assignment details', { error });
    }

    return assingmentMap;
  }

  /**
   * Fetches all assignments for a list of courses from the course-service.
   * @param courseIds An array of course IDs.
   * @returns An array of assignment objects with at least id and dueDate.
   */
  public static async getAssignmentsForCourses(
    courseIds: string[]
  ): Promise<{ id: string; dueDate: Date | null }[]> {
    if (courseIds.length === 0) {
      return [];
    }
    try {
      const response = await axios.post<
        { id: string; dueDate: string | null }[]
      >(
        `${this.courseServiceUrl}/api/courses/assignments/bulk`,
        { courseIds },
        {
          headers: {
            'x-internal-api-key': env.INTERNAL_API_KEY,
          },
        }
      );

      return response.data.map((a) => ({
        ...a,
        dueDate: a.dueDate ? new Date(a.dueDate) : null,
      }));
    } catch (error) {
      logger.error('Failed to bulk fetch assignments from course-service', {
        error,
      });
      return [];
    }
  }

  /**
   * Fetches the content of a single assignment submission from the course-service.
   * @param submissionId The ID of the submission.
   * @param cookie The authentication cookie of the user making the request.
   * @returns The submission content string, or null if not found.
   */
  public static async getSubmissionContent(
    submissionId: string,
    cookie: string
  ): Promise<string | null> {
    try {
      const response = await axios.get<{ content: string | null }>(
        `${this.courseServiceUrl}/api/assignments/submissions/${submissionId}/content`,
        {
          headers: {
            'x-internal-api-key': env.INTERNAL_API_KEY,
            Cookie: cookie,
          },
        }
      );

      return response.data.content;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        logger.warn(
          `Submission content not found in course-service for id: ${submissionId}`
        );
        return null;
      }

      logger.error(
        'Failed to fetch submission content from course-service: %o',
        {
          error,
        }
      );
      return null;
    }
  }

  /**
   * Sends a request to the course-service to initiate a re-grade for a submission.
   * @param submissionId The ID of the submission.
   * @param cookie The authentication cookie of the user making the request.
   * @returns A promise that resolves if the request is successful.
   * @throws Throws an error if the course-service returns an error.
   */
  public static async requestReGrade(
    submissionId: string,
    cookie: string
  ): Promise<void> {
    try {
      await axios.post(
        `${this.courseServiceUrl}/api/assignments/submissions/${submissionId}/request-re-grade`,
        {},
        {
          headers: {
            'x-internal-api-key': env.INTERNAL_API_KEY,
            Cookie: cookie,
          },
        }
      );

      logger.info(
        `Successfully sent re-grade request to course-service for submission ${submissionId}`
      );
    } catch (error) {
      logger.error(
        `Failed to send re-grade request to course-service for submission ${submissionId}: %o`,
        { error }
      );

      throw error;
    }
  }

  /**
   * Fetches details for multiple modules by their IDs from the course-service.
   * @param moduleIds An array of module IDs.
   * @returns A Map where the key is the module ID and the value is the module title.
   */
  public static async getModulesByIds(
    moduleIds: string[]
  ): Promise<Map<string, string>> {
    const moduleMap = new Map<string, string>();
    if (moduleIds.length === 0) return moduleMap;

    try {
      const response = await axios.post<{ id: string; title: string }[]>(
        `${this.courseServiceUrl}/api/modules/bulk`,
        { moduleIds }
      );

      response.data.forEach((module) => moduleMap.set(module.id, module.title));
    } catch (error) {
      logger.error('Failed to bulk fetch module details', { error });
    }
    return moduleMap;
  }

  /**
   * Fetches all upcoming, published assignments for a list of courses.
   * @param courseIds An array of course IDs.
   * @returns An array of assignment objects.
   */
  public static async getUpcomingAssignmentsForCourses(
    courseIds: string[]
  ): Promise<{ id: string; title: string; dueDate: string | null }[]> {
    if (courseIds.length === 0) {
      return [];
    }

    try {
      const response = await axios.post<
        { id: string; title: string; dueDate: string | null }[]
      >(
        `${this.courseServiceUrl}/api/assignments/upcoming-for-courses`,
        {
          courseIds,
        },
        {
          headers: {
            'x-internal-api-key': env.INTERNAL_API_KEY,
          },
        }
      );

      return response.data;
    } catch (error) {
      logger.error('Failed to bulk fetch upcoming assignments: %o', { error });
      return [];
    }
  }

  /**
   * Fetches the total time a student has spent on assignments across specific courses.
   * @param studentId The ID of the student.
   * @param courseIds An array of course IDs.
   * @returns The total hours spent on assignments.
   */
  public static async getTimeManagementSummary(
    studentId: string,
    courseIds: string[]
  ): Promise<{ activity: string; totalHours: number }> {
    if (courseIds.length === 0) {
      return { activity: 'Assignments', totalHours: 0 };
    }

    try {
      const response = await axios.get<{
        activity: string;
        totalHours: number;
      }>(`${this.courseServiceUrl}/api/assignments/drafts/time-summary`, {
        params: {
          studentId,
          courseIds: courseIds.join(','),
        },
        headers: {
          'x-internal-api-key': env.INTERNAL_API_KEY,
        },
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to fetch time management summary: %o', { error });

      return { activity: 'Assignments', totalHours: 0 };
    }
  }
}
