import { RedisClient } from '../clients/redis.client';
import { CourseWithInstructor } from '../types';

const COURSE_DETAILS_KEY = (id: string) => `course:details:${id}`;
const COURSES_LIST_PATTERN = 'courses:list:*';

export class CourseCacheService {
  /**
   * Retrieves a detailed object from the cache.
   * @param courseId The ID of the course
   * @returns The cached course object or null if not found
   */
  public static async getCourseDetails(
    courseId: string
  ): Promise<CourseWithInstructor | null> {
    return RedisClient.get<CourseWithInstructor>(COURSE_DETAILS_KEY(courseId));
  }

  /**
   * Stores a detailed course object in the cache
   * @param courseId The ID of the course
   * @param courseData The full course object to cache
   */
  public static async setCourseDetails(
    courseId: string,
    courseData: CourseWithInstructor
  ): Promise<void> {
    await RedisClient.set(COURSE_DETAILS_KEY(courseId), courseData);
  }

  /**
   * Invalidates the cache for a single course's details.
   * @param courseId The ID of the course to invalidate/
   */
  public static async invalidateCacheDetails(courseId: string): Promise<void> {
    await RedisClient.del(COURSE_DETAILS_KEY(courseId));
  }

  /**
   * Invalidates all cached lists of courses (e.g., all paginated results)
   */
  public static async invalidateCourseList(): Promise<void> {
    await RedisClient.delByPattern(COURSES_LIST_PATTERN);
  }
}
