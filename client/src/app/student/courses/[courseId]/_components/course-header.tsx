'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, BookOpen, Menu, Search, Settings } from 'lucide-react';

interface CourseHeaderProps {
  onThemeToggle: () => void;
}

export function CourseHeader({ onThemeToggle }: CourseHeaderProps) {
  return (
    <header className="border-border bg-card sticky top-0 z-50 border-b">
      <div className="px-4 py-4 md:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          {/* Logo & Title */}
          <div className="flex min-w-0 items-center gap-3">
            <div className="bg-primary text-primary-foreground flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
              <BookOpen className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold md:text-xl">
                Advanced React Patterns
              </h1>
              <p className="text-muted-foreground truncate text-xs md:text-sm">
                Instructor: Sarah Chen
              </p>
            </div>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden max-w-xs flex-1 md:flex">
            <div className="relative w-full">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input placeholder="Search lessons..." className="h-9 pl-10" />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="bg-destructive absolute top-1 right-1 h-2 w-2 rounded-full" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onThemeToggle}>
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
