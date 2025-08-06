"use server";

import { enrollmentService } from "@/lib/api";

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
