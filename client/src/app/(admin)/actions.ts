"use server";

import { userService } from "@/lib/api";
import { updateProfileSchema } from "@/lib/schemas/user";
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

export async function updateUserAsAdmin(
  userId: string,
  values: z.input<typeof updateProfileSchema>
) {
  try {
    const validatedData = updateProfileSchema.parse(values);

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
