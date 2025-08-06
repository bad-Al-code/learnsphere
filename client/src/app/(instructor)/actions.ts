"use server";

import { courseService, enrollmentService } from "@/lib/api";
import { createCourseSchema } from "@/lib/schemas/course";
import { revalidatePath } from "next/cache";
import z from "zod";

export async function getInstructorAnalytics() {
  try {
    const response = await enrollmentService.get("/api/analytics/instructor");

    if (!response.ok) {
      console.error("Failed to fetch instructor analytics, response not ok.");

      return { totalStudents: 0, totalRevenue: 0, chartData: [] };
    }

    const result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error("Error fetching instructor analytics:", error);

    return { totalStudents: 0, totalRevenue: 0, chartData: [] };
  }
}

export async function getMyCourses() {
  try {
    const response = await courseService.get("/api/courses/my-courses");
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch instructor courses:", error);
    return [];
  }
}

export async function createCourse(values: z.infer<typeof createCourseSchema>) {
  try {
    const validatedData = createCourseSchema.parse(values);

    const response = await courseService.post("/api/courses", validatedData);

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.errors?.[0]?.message || "Failed to create course.");
    }

    const newCourse = await response.json();

    revalidatePath("/dashboard/instructor/courses");

    return { success: true, data: newCourse };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: error.message };
  }
}
