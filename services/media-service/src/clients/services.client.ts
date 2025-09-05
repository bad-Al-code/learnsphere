import axios from 'axios';
import { env } from '../config/env';

interface BulkUser {
  userId: string;
  firstName?: string | null;
  lastName?: string | null;
}

interface BulkCourse {
  id: string;
  title: string;
}

export class ServiceClient {
  public static async fetchUserProfiles(
    userIds: string[]
  ): Promise<Map<string, BulkUser>> {
    const userMap = new Map<string, BulkUser>();
    if (userIds.length === 0) return userMap;

    const response = await axios.post(
      `${env.USER_SERVICE_URL}/api/users/bulk`,
      { userIds }
    );

    const profiles: BulkUser[] = response.data;
    profiles.forEach((p) => userMap.set(p.userId, p));

    return userMap;
  }

  public static async fetchCourseDetails(
    courseIds: string[]
  ): Promise<Map<string, BulkCourse>> {
    const courseMap = new Map<string, BulkCourse>();
    if (courseIds.length === 0) return courseMap;

    const response = await axios.post(
      `${env.COURSE_SERVICE_URL}/api/courses/bulk`,
      { courseIds }
    );

    const courses: BulkCourse[] = response.data;
    courses.forEach((c) => courseMap.set(c.id, c));

    return courseMap;
  }
}
