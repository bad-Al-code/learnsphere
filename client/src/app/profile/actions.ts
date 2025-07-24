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

const avatarUploadUrlschema = z.object({
  filename: z.string(),
  uploadType: z.literal("avatar"),
  metadata: z.record(z.string(), z.string()),
});

type AvataruploadUrlschema = z.infer<typeof avatarUploadUrlschema>;

export async function getAvatarUploadUrl(values: AvataruploadUrlschema) {
  try {
    const validatedData = avatarUploadUrlschema.parse(values);
    const response = await userService.post(
      "/api/users/me/avatar-upload-url",
      validatedData
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.errors?.[0]?.message || "Failed to get upload URL."
      );
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error: any) {
    return { error: error.message || "An unexpected error occurred." };
  }
}
