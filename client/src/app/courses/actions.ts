"use server";

import { courseService } from "@/lib/api";

export async function getPublicCourses({
  page = 1,
  limit = 12,
}: {
  page?: number;
  limit?: number;
}) {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    const response = await courseService.get(
      `/api/courses?${params.toString()}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch courses.");
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error(`Error fetching public courses: `, error);

    return {
      results: [],
      pagination: { currentPage: 1, totalPages: 0, totalResults: 0, limit: 12 },
    };
  }
}

export async function getCourseDetails(courseId: string) {
  try {
    const response = await courseService.get(`/api/courses/${courseId}`);
    if (!response.ok) {
      throw new Error("Course not found.");
    }

    const result = await response.json();
    console.log(result);

    return result;
  } catch (error) {
    console.error(`Error fetching course details for ${courseId}`);

    return null;
  }
}
