import { enrollmentStatusEnum } from "../db/schema";

export interface CourseDetails {
  id: string;
  status: "draft" | "published";
  modules: {
    id: string;
    lessons: {
      id: string;
    }[];
  }[];
}

export interface PublicCourseData {
  id: string;
  title: string;
  description?: string | null;
  instructor?: {
    firstName?: string | null;
    lastName?: string | null;
    avatarUrls?: { small?: string };
  };
}

export interface PublicUserData {
  userId: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrls?: { small?: string };
}

export interface GetEnrollmentsOptions {
  courseId: string;
  requester: Requester;
  page: number;
  limit: number;
}

export interface UserEnrollmentData {
  userId: string;
  courseId: string;
}

export interface MarkProgressData {
  userId: string;
  courseId: string;
  lessonId: string;
}

export interface Requester {
  id: string;
  role: "student" | "instructor" | "admin";
}

export interface ManualEnrollmentData {
  userId: string;
  courseId: string;
  requester: Requester;
}

export type EnrollmentStatus = (typeof enrollmentStatusEnum.enumValues)[number];

export interface ChangeEnrollmentStatus {
  enrollmentId: string;
  newStatus: EnrollmentStatus;
  requester: Requester;
}

export interface UserEnrollmentStatus {
  enrollmentId: string;
  requester: Requester;
}
