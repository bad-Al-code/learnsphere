"use client";

import { logout } from "@/app/(auth)/actions";
import { useSessionStore } from "@/stores/session-store";
import Link from "next/link";
import { useEffect, useTransition } from "react";
import { Button } from "../ui/button";

type User = {
  userId: string;
  firstName: string | null;
  lastName: string | null;
} | null;

export function Header({ user: initialUser }: { user: User }) {
  const { user, setUser } = useSessionStore();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser, setUser]);

  const handleLogout = () => {
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">LearnSphere</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/courses"
              className="transition-colors hover:text-foreground/80"
            >
              Courses
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav>
            {user ? (
              <div className="flex items-center space-x-4">
                <span>Hello, {user.firstName || "User"}</span>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  disabled={isPending}
                >
                  {isPending ? "Logging out..." : "Logout"}
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button asChild variant="ghost">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
