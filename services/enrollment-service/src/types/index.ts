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

export interface UserEnrollmentData {
  userId: string;
  courseId: string;
}

export interface MarkProgressData {
  userId: string;
  courseId: string;
  lessonId: string;
}
