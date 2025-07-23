"use client";

import { useSessionStore } from "@/stores/session-store";
import { useEffect } from "react";

import { getCurrentUser } from "@/app/(auth)/actions";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const setUser = useSessionStore((state) => state.setUser);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      setUser(user);
    };
    fetchUser();
  }, [setUser]);

  return <>{children}</>;
}
