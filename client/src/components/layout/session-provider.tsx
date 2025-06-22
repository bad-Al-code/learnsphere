"use client";

import { trpc } from "@/lib/trpc/client";
import { useSessionStore } from "@/stores/session-store";
import { useEffect } from "react";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = trpc.user.getMe.useQuery();
  const setUser = useSessionStore((state) => state.setUser);

  useEffect(() => {
    if (user) {
      setUser(user);
    }
  }, [user, setUser]);

  return <>{children}</>;
}
