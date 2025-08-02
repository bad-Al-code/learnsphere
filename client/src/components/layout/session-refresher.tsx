"use client";
import { refreshToken } from "@/lib/auth";
import { useEffect } from "react";

export function SessionRefresher() {
  useEffect(() => {
    const onFocus = () => {
      refreshToken();
    };

    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  return null;
}
