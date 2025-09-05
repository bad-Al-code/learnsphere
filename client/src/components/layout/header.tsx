'use client';

import { logout } from '@/app/(auth)/actions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  adminNavItems,
  instructorNavItems,
  publicNavItems,
} from '@/config/nav-items';
import { getInitials } from '@/lib/utils';
import { useSessionStore } from '@/stores/session-store';
import { User } from '@/types/user';
import {
  ChevronsDownUp,
  ChevronsUpDown,
  LogOut,
  Menu,
  User as UserIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { iconMap } from '../shared/icons';
import { Logo } from '../shared/logo';
import { ModeToggle } from '../shared/mode-toggle';
import { SearchBar } from '../shared/search-bar';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '../ui/sheet';
import { InstructorApplyButton } from './instructor-apply-button';
import { NotificationBell } from './notification-bell';

export function Header({ user: initialUser }: { user: User | null }) {
  const pathname = usePathname();
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

  const getMobileNavItems = () => {
    if (user?.role === 'admin') {
      return adminNavItems;
    }
    if (user?.role === 'instructor') {
      return instructorNavItems;
    }
    return publicNavItems;
  };

  const mobileNavItems = getMobileNavItems();

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-0">
        {/* Logo */}
        <div className="flex gap-12 md:gap-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Logo className="w-32" />
            </Link>
          </div>

          {/* Center Nav (Desktop only) */}
          <nav className="hidden flex-1 items-center justify-center space-x-6 text-sm font-medium sm:flex">
            {publicNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-foreground/80 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

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

          <NotificationBell />
          {/* Theme Toggle */}
          <ModeToggle />

          {/* Desktop Avatar & Instructor */}
          {user ? (
            <div className="hidden items-center space-x-2 sm:flex">
              <InstructorApplyButton />
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  className="bg-background/95 supports-[backdrop-filter]:bg-background/60 backdrop-blur"
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
                  className="bg-background/95 supports-[backdrop-filter]:bg-background/60 w-56 backdrop-blur"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm leading-none font-medium">
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
            <div className="hidden items-center space-x-2 sm:flex">
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
                className="sm:w-80p bg-background/95 supports-[backdrop-filter]:bg-background/50 flex w-64 justify-between px-4 backdrop-blur"
              >
                <div className="flex flex-col">
                  <SheetHeader>
                    <Link
                      href="/"
                      className="mb-4 flex items-center"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      <Logo className="w-28" />
                    </Link>
                  </SheetHeader>

                  <nav className="mt-6 flex flex-col space-y-4 px-4 text-sm font-medium">
                    {mobileNavItems.map((item) => {
                      const Icon = iconMap[item.icon];
                      const isActive = pathname === item.href;

                      return (
                        <Button
                          key={item.href}
                          asChild
                          variant={isActive ? 'secondary' : 'ghost'}
                          className="w-full justify-start gap-2"
                        >
                          <Link
                            href={item.href}
                            className="flex items-center gap-2"
                          >
                            <Icon className="h-4 w-4" />
                            {item.label}
                          </Link>
                        </Button>
                      );
                    })}
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
                            className="border-border hover:bg-muted flex w-full items-center justify-between gap-2 rounded-md border p-2 text-left transition"
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
                              <ChevronsDownUp className="h-4 w-4" />
                            ) : (
                              <ChevronsUpDown className="h-4 w-4" />
                            )}
                          </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                          side="top"
                          align="center"
                          className="bg-background/95 supports-[backdrop-filter]:bg-background/6 mt-2 w-full backdrop-blur"
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
