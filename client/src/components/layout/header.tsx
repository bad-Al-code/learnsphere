"use client";

import { useSessionStore } from "@/stores/session-store";
import Link from "next/link";
import { Button } from "../ui/button";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";

export function Header() {
  const user = useSessionStore((state) => state.user);
  const setUser = useSessionStore((state) => state.setUser);
  const router = useRouter();

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      setUser(null);
      router.push("/");
      router.refresh();
    },
  });

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
              className="text-foreground/60 transition-colors hover:text-foreground/80"
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
                  onClick={() => logoutMutation.mutate()}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
