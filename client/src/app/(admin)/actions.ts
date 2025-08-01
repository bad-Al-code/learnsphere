"use server";

import { userService } from "@/lib/api";
import { revalidatePath } from "next/cache";

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
