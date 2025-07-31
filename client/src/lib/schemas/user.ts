import * as z from "zod";

export const socialLinksSchema = z.object({
  twitter: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  github: z.string().optional().nullable(),
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
  websiteUrl: z.string().optional().or(z.literal("")).nullable(),
  socialLinks: socialLinksSchema.optional().nullable(),
});

export const updateProfileSchema = profileFormSchema.transform((data) => {
  const { language, ...profileData } = data;
  const settingsData = { language };

  const nullifyEmpty = (value: string | null | undefined) =>
    value === "" ? null : value;

  const transformedProfileData = {
    ...profileData,
    websiteUrl: nullifyEmpty(profileData.websiteUrl),
    socialLinks: {
      github: nullifyEmpty(profileData.socialLinks?.github),
      linkedin: nullifyEmpty(profileData.socialLinks?.linkedin),
      twitter: nullifyEmpty(profileData.socialLinks?.twitter),
    },
  };

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
