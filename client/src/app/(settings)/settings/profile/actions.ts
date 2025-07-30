"use server";

import { userService } from "@/lib/api";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const onboardingSchema = z
  .object({
    headline: z.string().min(1),
    bio: z.string().optional(),
    websiteUrl: z.url("Invalid URL format").optional().or(z.literal("")),
    socialLinks: z
      .object({
        twitter: z.string().optional(),
        linkedin: z.string().optional(),
        github: z.string().optional(),
      })
      .optional()
      .nullable(),
  })
  .transform((data) => ({
    ...data,
    websiteUrl: data.websiteUrl === "" ? null : data.websiteUrl,
  }));

export type OnboardingInput = z.input<typeof onboardingSchema>;
export type OnboardingOutput = z.output<typeof onboardingSchema>;

export async function completeOnboarding(values: OnboardingInput) {
  try {
    const validatedData: OnboardingOutput = onboardingSchema.parse(values);

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
    if (error instanceof z.ZodError) {
      return { error: error.issues[0]?.message || "Validation failed." };
    }
    return { error: "An unexpected error occurred." };
  }
}
