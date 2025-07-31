"use client";

import { logout } from "@/app/(auth)/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSessionStore } from "@/stores/session-store";
import { User } from "@/types/user";
import {
  ChevronsDownUp,
  ChevronsUpDown,
  LogOut,
  Menu,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { Logo } from "../shared/logo";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "../ui/sheet";

const getInitials = (firstName: string | null, lastName: string | null) => {
  const first = firstName?.[0] || "";
  const last = lastName?.[0] || "";
  return `${first}${last}`.toUpperCase();
};

export function Header({ user: initialUser }: { user: User }) {
  const { user, setUser } = useSessionStore();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
      <div className="grid grid-cols-12 items-center h-16 px-4 gap-4">
        <div className="col-span-4 sm:col-span-3 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="w-32" />
          </Link>
        </div>

        <nav className="hidden sm:flex col-span-6 justify-center space-x-6 text-sm font-medium">
          <Link
            href="/courses"
            className="transition-colors hover:text-foreground/80"
          >
            Courses
          </Link>
          <Link
            href="/blog"
            className="transition-colors hover:text-foreground/80"
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="transition-colors hover:text-foreground/80"
          >
            About
          </Link>
        </nav>

        <div className="flex sm:hidden col-span-8 items-end justify-end">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-64 sm:w-80p px-4 flex justify-between"
            >
              <div className="flex flex-col">
                <SheetHeader>
                  <Link
                    href="/"
                    className="flex items-center mb-4"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    <Logo className="w-28" />
                  </Link>
                </SheetHeader>

                <nav className="flex flex-col space-y-4 mt-6 px-4 text-sm font-medium">
                  <Link
                    href="/courses"
                    className="hover:text-foreground/80"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    Courses
                  </Link>
                  <Link
                    href="/blog"
                    className="hover:text-foreground/80"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    Blog
                  </Link>
                  <Link
                    href="/about"
                    className="hover:text-foreground/80"
                    onClick={() => setIsSheetOpen(false)}
                  >
                    About
                  </Link>
                </nav>
              </div>

              <div className="my-8">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="w-full flex items-center justify-between gap-2 p-2 rounded-md border border-border hover:bg-muted transition text-left"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={user.avatarUrls?.small}
                              alt="User Avatar"
                            />
                            <AvatarFallback>
                              {getInitials(user.firstName, user.lastName)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">
                            {user.firstName} {user.lastName}
                          </span>
                        </div>
                        {dropdownOpen ? (
                          <ChevronsDownUp className="w-4 h-4" />
                        ) : (
                          <ChevronsUpDown className="w-4 h-4" />
                        )}
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      side="top"
                      align="center"
                      className="w-full mt-2"
                      onCloseAutoFocus={() => setDropdownOpen(false)}
                      onInteractOutside={() => setDropdownOpen(false)}
                      onEscapeKeyDown={() => setDropdownOpen(false)}
                      forceMount
                    >
                      <DropdownMenuItem asChild>
                        <Link
                          href="/settings/profile"
                          onClick={() => setIsSheetOpen(false)}
                        >
                          <UserIcon className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          handleLogout();
                          setIsSheetOpen(false);
                        }}
                        disabled={isPending}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Button asChild variant="outline">
                      <Link href="/login" onClick={() => setIsSheetOpen(false)}>
                        Login
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link
                        href="/signup"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden sm:flex col-span-3 justify-end items-center space-x-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar>
                    <AvatarImage
                      src={user.avatarUrls?.small}
                      alt="User Avatar"
                    />
                    <AvatarFallback>
                      {getInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings/profile">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} disabled={isPending}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
        </div>
      </div>
    </header>
  );
}
