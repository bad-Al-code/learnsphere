"use server";

import { ApiError, userService } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required."),
  lastName: z.string().min(1, "Last name is required."),
  headline: z.string().optional(),
  bio: z.string().optional(),
});

type ProfileSchema = z.infer<typeof profileSchema>;

export async function updateProfile(values: ProfileSchema) {
  try {
    const validatedData = profileSchema.parse(values);

    const response = await userService.put("/api/users/me", validatedData);

    if (!response.ok) {
      const responseData = await response.json().catch(() => ({}));
      const errorMessage =
        responseData.errors?.[0]?.message || "Failed to update profile.";
      return { error: errorMessage };
    }

    revalidatePath("/profile");

    return { success: true };
  } catch (error: any) {
    if (error instanceof ApiError) {
      return { error: error.message };
    }
    return { error: "An unexpected error occurred." };
  }
}

export async function getAvatarUploadUrl(values: { filename: string }) {
  try {
    const response = await userService.post("/api/users/me/avatar-upload-url", {
      filename: values.filename,
    });

    if (!response.ok) {
      throw new Error("Failed to get upload URL.");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred." };
  }
}
