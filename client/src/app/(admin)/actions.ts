"use server";

import { courseService, userService } from "@/lib/api";
import { profileFormSchema } from "@/lib/schemas/user";
import { revalidatePath } from "next/cache";
import z from "zod";

async function performUserAction(
  userId: string,
  action: "approve" | "suspend" | "reinstate"
) {
  const endpointMap = {
    approve: `/api/users/${userId}/approve-instructor`,
    suspend: `/api/users/${userId}/suspend`,
    reinstate: `/api/users/${userId}/reinstate`,
  };

  try {
    const response = await userService.post(endpointMap[action], {});
    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage =
        responseData.errors?.[0]?.message || `Failed to ${action} user.`;
      return { error: errorMessage };
    }

    revalidatePath(`/admin/users/${userId}`);
    return { success: true, message: responseData.message };
  } catch (error: any) {
    return { error: "An unexpected error occurred." };
  }
}

export async function approveInstructor(userId: string) {
  return performUserAction(userId, "approve");
}

export async function suspendUser(userId: string) {
  return performUserAction(userId, "suspend");
}

export async function reinstateUser(userId: string) {
  return performUserAction(userId, "reinstate");
}

const adminUpdateProfileSchema = profileFormSchema
  .pick({
    firstName: true,
    lastName: true,
    headline: true,
    bio: true,
    websiteUrl: true,
    socialLinks: true,
  })
  .transform((data) => {
    const nullifyEmpty = (value: string | null | undefined) =>
      value === "" ? null : value;

    return {
      ...data,
      websiteUrl: nullifyEmpty(data.websiteUrl),
      socialLinks: {
        github: nullifyEmpty(data.socialLinks?.github),
        linkedin: nullifyEmpty(data.socialLinks?.linkedin),
        twitter: nullifyEmpty(data.socialLinks?.twitter),
      },
    };
  });

export async function updateUserAsAdmin(
  userId: string,
  values: z.input<typeof adminUpdateProfileSchema>
) {
  try {
    const validatedData = adminUpdateProfileSchema.parse(values);

    const response = await userService.put(
      `/api/users/${userId}`,
      validatedData
    );

    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage =
        responseData.errors?.[0]?.message || "Failed to update profile.";
      return { error: errorMessage };
    }

    revalidatePath(`/admin/users/${userId}`);
    revalidatePath("/admin/users");
    return { success: true };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: "An unexpected error occurred." };
  }
}

export async function getUserStats() {
  try {
    const response = await userService.get("/api/users/stats");
    if (!response.ok) {
      return { totalUsers: 0, pendingApplications: 0 };
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error("Failed to fetch user stats:", error);
    return { totalUsers: 0, pendingApplications: 0 };
  }
}

export async function getCourseStats() {
  try {
    const response = await courseService.get("/api/courses/stats");
    if (!response.ok) {
      return { totalCourses: 0 };
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error("Failed to fetch user stats:", error);
    return { totalUsers: 0, pendingApplications: 0 };
  }
}

export async function searchAllCourses({
  query = "",
  page = 1,
  limit = 10,
}: {
  query?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const params = new URLSearchParams({
      q: query,
      page: String(page),
      limit: String(limit),
    });

    const response = await courseService.get(
      `/api/courses/admin-search?${params.toString()}`
    );

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));

      throw new Error(data.errors?.[0]?.message || "Failed to search courses.");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error searching all courses:", error);
    return {
      results: [],
      pagination: { currentPage: 1, totalPages: 0, totalResults: 0, limit: 10 },
    };
  }
}
