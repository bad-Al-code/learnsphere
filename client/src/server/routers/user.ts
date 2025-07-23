import { z } from "zod";
import { publicProcedure, router } from "../trpc";

const userProfileSchema = z.object({
  userId: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  bio: z.string().nullable(),
  headline: z.string().nullable(),
  websiteUrl: z.string().nullable(),
  socialLinks: z
    .object({
      twitter: z.string().nullable(),
      linkedin: z.string().nullable(),
      github: z.string().nullable(),
    })
    .nullable(),
});

export const userRouter = router({
  getMe: publicProcedure.query(async ({ ctx }) => {
    try {
      const { data } = await ctx.api("user").get("/api/users/me");

      return data;
    } catch (error: any) {
      console.error("Error fetching user:", error.message);

      return null;
    }
  }),
});
