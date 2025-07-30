"use server";

import { userService } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const updateProfileSchema = z
  .object({
    headline: z.string().min(1),
    bio: z.string().optional(),
    websiteUrl: z.url("Invalid URL format").optional().or(z.literal("")),
    language: z.string().optional(),
    socialLinks: z
      .object({
        twitter: z.string().optional(),
        linkedin: z.string().optional(),
        github: z.string().optional(),
      })
      .optional()
      .nullable(),
  })
  .transform((data) => {
    const { language, ...profileData } = data;
    const settingsData = { language };

    const transformedProfileData = {
      ...profileData,
      websiteUrl: profileData.websiteUrl === "" ? null : profileData.websiteUrl,
      socialLinks: {
        github: profileData.socialLinks?.github || null,
        linkedin: profileData.socialLinks?.linkedin || null,
        twitter: profileData.socialLinks?.twitter || null,
      },
    };

    return { profileData: transformedProfileData, settingsData };
  });

export type OnboardingInput = z.input<typeof updateProfileSchema>;
export type OnboardingOutput = z.output<typeof updateProfileSchema>;

export async function completeOnboarding(values: OnboardingInput) {
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
      return { error: error.issues[0]?.message || "Validation failed." };
    }
    return { error: "An unexpected error occurred." };
  }
}
