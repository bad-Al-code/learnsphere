import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";
import { appRouter } from "@/server";
import { headers } from "next/headers";

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({
      headers: {
        cookie: headers().get("cookie") ?? "",
      },
    }),
  });

export { handler as GET, handler as POST };
