import { enrollments, enrollmentStatusEnum } from '../db/schema';

export type Enrollment = typeof enrollments.$inferSelect;
export type NewEnrollment = typeof enrollments.$inferInsert;
export type UpdateEnrollment = Partial<
  Omit<Enrollment, 'id' | 'userId' | 'courseId' | 'enrolledAt' | 'updatedAt'>
>;

export interface CourseDetails {
  id: string;
  status: 'draft' | 'published';
  prerequisiteCourseId?: string | null;
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

export interface UserProfileData {
  userId: string;
  firstName?: string | null;
  lastName?: string | null;
  avatarUrls?: { small?: string };
  dateOfBirth?: string | null;
  lastKnownDevice?: string | null;
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
  role: 'student' | 'instructor' | 'admin';
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

export interface ResetProgressData {
  enrollmentId: string;
  requesterId: string;
}

export interface CourseStructureSnapshotDetails {
  modules: {
    id: string;
    lessons: { id: string }[];
  }[];
}
