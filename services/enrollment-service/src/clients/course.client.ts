import axios, { isAxiosError } from "axios";
import { env } from "../config/env";
import logger from "../config/logger";
import { NotFoundError } from "../errors";
import { CourseDetails, PublicCourseData } from "../types";

export class CourseClient {
  private static courseServiceUrl = env.COURSE_SERVICE_URL;

  /**
   * Fetches the full details of a single course.
   * @param courseId The ID of the course to fetch.
   * @returns The detailed course object.
   * @throws {NotFoundError} if the course is not found.
   */
  public static async getCourseDetails(courseId: string): Promise<CourseDetails> {
    try {
      logger.debug(`Fetching course details for ${courseId} from course-service`);

      const response = await axios.get<CourseDetails>(`${this.courseServiceUrl}/api/courses/${courseId}`);

      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        throw new NotFoundError('Course')
      }

      throw error;
    }
  }

  /**
    * Fetches multiple public course data objects in a single bulk request.
    * @param courseIds An array of course IDs.
    * @returns A Map of courseId to public course data.
    */
  public static async getCourseInBatch(courseIds: string[]): Promise<Map<string, PublicCourseData>> {
    if (courseIds.length === 0) return new Map();

    try {
      logger.debug(`Batch fetching ${courseIds.length} courses from course-service`);

      const response = await axios.post<PublicCourseData[]>(`${this.courseServiceUrl}/api/courses/bulk`, { courseIds });

      const courseMap = new Map<string, PublicCourseData>();
      for (const course of response.data) {
        courseMap.set(course.id, course);
      }

      return courseMap;
    } catch (error) {
      logger.error(`Failed to batch fetch courses from course-service`, { error });

      return new Map();
    }
  }
}