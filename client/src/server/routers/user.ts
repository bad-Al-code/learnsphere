import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import { apiClient } from "@/lib/api/client";

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
      const { data } = await apiClient.get("/api/users/me", {
        headers: ctx.headers,
      });
      return data;
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        return null;
      }

      console.error("Error fetching user:", error.message);
      return null;
    }
  }),
});
