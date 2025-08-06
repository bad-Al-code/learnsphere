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
import { getInitials } from "@/lib/utils";
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
import { ModeToggle } from "../shared/mode-toggle";
import { SearchBar } from "../shared/search-bar";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "../ui/sheet";
import { InstructorApplyButton } from "./instructor-apply-button";

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
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Logo className="w-32" />
          </Link>
        </div>

        {/* Center Nav (Desktop only) */}
        <nav className="hidden sm:flex flex-1 justify-center items-center space-x-6 text-sm font-medium">
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

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* SearchBar */}
          <div className="hidden md:block">
            <SearchBar />
          </div>

          {/* Mobile Search Icon Only */}
          <div className="block md:hidden">
            <SearchBar />
          </div>

          {/* Theme Toggle */}
          <ModeToggle />

          {/* Desktop Avatar & Instructor */}
          {user ? (
            <div className="hidden sm:flex items-center space-x-2">
              <InstructorApplyButton />
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
                >
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
                <DropdownMenuContent
                  className="w-56 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
                  align="end"
                  forceMount
                >
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
            </div>
          ) : (
            <div className="hidden sm:flex items-center space-x-2">
              <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Sheet Menu */}
          <div className="sm:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-64 sm:w-80p px-4 flex justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/50"
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

                <div className="my-4">
                  {user ? (
                    <>
                      <InstructorApplyButton />
                      <DropdownMenu>
                        <DropdownMenuTrigger className="mt-2" asChild>
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
                          className="w-full mt-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/6"
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
                    </>
                  ) : (
                    <div className="flex flex-col space-y-2">
                      <Button asChild variant="outline">
                        <Link
                          href="/login"
                          onClick={() => setIsSheetOpen(false)}
                        >
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
        </div>
      </div>
    </header>
  );
}
