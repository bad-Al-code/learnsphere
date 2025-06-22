import { z } from "zod";

import { publicProcedure, router } from "../trpc";
import { apiClient } from "@/lib/api/client";
import { TRPCError } from "@trpc/server";

export const authRouter = router({
  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
    .mutation(async ({ input }) => {
      try {
        const { data } = await apiClient.post("/api/auth/login", input);

        return data;
      } catch (error: any) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: error.response?.data?.errors?.[0]?.message || "Login Failed",
          cause: error,
        });
      }
    }),
});
