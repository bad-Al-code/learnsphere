import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { headers } from "next/headers";
import { type NextRequest } from "next/server";

import { createApiClient } from "@/lib/api/client";
import { appRouter } from "@/server";

const createContext = async () => {
  const cookie = (await headers()).get("cookie") ?? "";

  return {
    api: (service: Parameters<typeof createApiClient>[0]) =>
      createApiClient(service, { cookie }),
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext,
  });

export { handler as GET, handler as POST };
