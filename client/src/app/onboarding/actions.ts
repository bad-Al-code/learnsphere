"use server";

import { userService } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const onboardingSchema = z.object({
  headline: z.string().min(1),
  bio: z.string().optional(),
  websiteUrl: z.string().url().optional().or(z.literal("")),
});

export async function completeOnboarding(
  values: z.infer<typeof onboardingSchema>
) {
  try {
    const validatedData = onboardingSchema.parse(values);

    const response = await userService.put("/api/users/me", validatedData);

    if (!response.ok) {
      const responseData = await response.json().catch(() => ({}));
      const errorMessage =
        responseData.errors?.[0]?.message || "Failed to update profile.";
      return { error: errorMessage };
    }

    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    return { error: "An unexpected error occurred." };
  }
}
