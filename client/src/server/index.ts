import { authRouter } from "./routers/auth";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return {
      status: "ok",
      message: "tRPC is running!",
    };
  }),

  auth: authRouter,
});

export type AppRouter = typeof appRouter;
