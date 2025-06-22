import { authRouter } from "./routers/auth";
import { userRouter } from "./routers/user";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return {
      status: "ok",
      message: "tRPC is running!",
    };
  }),

  auth: authRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
