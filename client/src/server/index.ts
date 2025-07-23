import {
  authRouter,
  courseRouter,
  enrollmentRouter,
  mediaRouter,
  notificationRouter,
  userRouter,
} from "./routers";
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
  course: courseRouter,
  enrollment: enrollmentRouter,
  media: mediaRouter,
  notification: notificationRouter,
});

export type AppRouter = typeof appRouter;
