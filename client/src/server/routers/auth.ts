import { z } from "zod";

import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../trpc";

export const authRouter = router({
  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
    .mutation(async ({ input, ctx }) => {
      try {
        const response = await ctx.api("auth").post("/api/auth/login", input);

        return response.data;
      } catch (error: any) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: error.response?.data?.errors?.[0]?.message || "Login Failed",
          cause: error,
        });
      }
    }),

  logout: publicProcedure.mutation(async ({ ctx }) => {
    try {
      await ctx.api("auth").post("/api/auth/logout");

      return { success: true };
    } catch (error: any) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to logout",
        cause: error,
      });
    }
  }),
});
