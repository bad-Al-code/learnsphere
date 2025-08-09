import * as z from 'zod';

export const socialLinksSchema = z.object({
  twitter: z.string().optional().nullable(),
  linkedin: z.string().optional().nullable(),
  github: z.string().optional().nullable(),
});

export const profileFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required.').optional().nullable(),
  lastName: z.string().optional().nullable(),
  email: z.string(),
  headline: z
    .string()
    .min(1, 'A headline is required.')
    .max(100, 'Headline is too long.'),
  bio: z.string().max(500, 'Bio is too long.').optional().nullable(),
  language: z.string().optional(),
  websiteUrl: z.string().optional().or(z.literal('')).nullable(),
  socialLinks: socialLinksSchema.optional().nullable(),
});

export const updateProfileSchema = profileFormSchema.transform((data) => {
  const { language, ...profileData } = data;
  const settingsData = { language };

  const nullifyEmpty = (value: string | null | undefined) =>
    value === '' ? null : value;

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
  email: true,
  headline: true,
  bio: true,
  websiteUrl: true,
  socialLinks: true,
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
export type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;

export const instructorApplicationSchema = z.object({
  expertise: z.string().min(5, 'Please provide more detail.'),
  experience: z
    .string()
    .min(10, 'Please describe your experience in more detail.'),
  motivation: z.string().min(20, 'Please tell us more about your motivation.'),
});

export type InstructorApplicationFormValues = z.infer<
  typeof instructorApplicationSchema
>;
