import { courseService, enrollmentService } from "@/lib/api";

export async function checkEnrollmentStatus(courseId: string) {
  try {
    const response = await enrollmentService.get(
      `/api/enrollments/check/${courseId}`
    );
    if (!response.ok) return null;

    const result = await response.json();

    return result;
  } catch (error) {
    return null;
  }
}

export async function getLessonDetails(lessonId: string) {
  try {
    const response = await courseService.get(`/api/lessons/${lessonId}`);
    if (!response.ok) return null;

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Error fetching lesson details for ${lessonId}:`, error);
    return null;
  }
}
