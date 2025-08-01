"use server";

import { ApiError, userService } from "@/lib/api";
import {
  InstructorApplicationFormValues,
  instructorApplicationSchema,
  updateProfileSchema,
} from "@/lib/schemas/user";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function updateProfile(
  values: z.input<typeof updateProfileSchema>
) {
  try {
    const { profileData, settingsData } = updateProfileSchema.parse(values);

    const apiCalls: Promise<Response>[] = [];
    apiCalls.push(userService.put("/api/users/me", profileData));
    if (settingsData.language) {
      apiCalls.push(userService.put("/api/users/me/settings", settingsData));
    }

    const responses = await Promise.all(apiCalls);

    for (const response of responses) {
      if (!response.ok) {
        const responseData = await response.json().catch(() => ({}));
        const errorMessage =
          responseData.errors?.[0]?.message || "Failed to update profile.";
        return { error: errorMessage };
      }
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
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

const notificationsSchema = z.object({
  notifications: z.object({
    newCourseAlerts: z.boolean(),
    weeklyNewsletter: z.boolean(),
  }),
});

export async function updateNotificationSettings(values: {
  newCourseAlerts: boolean;
  weeklyNewsletter: boolean;
}) {
  try {
    const validatedData = notificationsSchema.parse({ notifications: values });

    const response = await userService.put(
      "/api/users/me/settings",
      validatedData
    );

    if (!response.ok) {
      const responseData = await response.json().catch(() => ({}));
      const errorMessage =
        responseData.errors?.[0]?.message || "Failed to update settings.";
      return { error: errorMessage };
    }

    revalidatePath("/settings/notifications");
    return { success: true };
  } catch (error: any) {
    if (error instanceof ApiError) {
      return { error: error.message };
    }
    return { error: "An unexpected error occurred." };
  }
}

export async function applyForInstructor(
  values: InstructorApplicationFormValues
) {
  try {
    const validatedData = instructorApplicationSchema.parse(values);

    const response = await userService.post(
      "/api/users/me/apply-for-instructor",
      validatedData
    );
    const responseData = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage =
        responseData.errors?.[0]?.message || "Failed to submit application.";

      return { error: errorMessage };
    }

    revalidatePath("/", "layout");

    return { success: true, message: responseData.message };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    return { error: "An unexpected error occurred." };
  }
}
