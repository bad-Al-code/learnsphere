import * as z from "zod";

export const socialLinksSchema = z.object({
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
});

export const profileFormSchema = z.object({
  firstName: z.string().min(1, "First name is required.").optional().nullable(),
  lastName: z.string().min(1, "Last name is required.").optional().nullable(),
  headline: z
    .string()
    .min(1, "A headline is required.")
    .max(100, "Headline is too long."),
  bio: z.string().max(500, "Bio is too long.").optional().nullable(),
  language: z.string().optional(),
  websiteUrl: z
    .url("Invalid URL format")
    .optional()
    .or(z.literal(""))
    .nullable(),
  socialLinks: socialLinksSchema.optional().nullable(),
});

export const updateProfileSchema = profileFormSchema.transform((data) => {
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

  if (transformedProfileData.socialLinks.github === "") {
    transformedProfileData.socialLinks.github = null;
  }
  if (transformedProfileData.socialLinks.linkedin === "") {
    transformedProfileData.socialLinks.linkedin = null;
  }
  if (transformedProfileData.socialLinks.twitter === "") {
    transformedProfileData.socialLinks.twitter = null;
  }

  return { profileData: transformedProfileData, settingsData };
});

export const onboardingFormSchema = profileFormSchema.pick({
  headline: true,
  bio: true,
  websiteUrl: true,
  socialLinks: true,
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
export type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;
