'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ArrowUpDown, ChevronDown, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { SORT_OPTIONS, useEnrolledCoursesStore } from '../store';

export function CourseFilters() {
  const { sortBy, setSortBy, setQuery } = useEnrolledCoursesStore();
  const [localQuery, setLocalQuery] = useState('');
  const [debouncedQuery] = useDebounce(localQuery, 300);

  useEffect(() => {
    setQuery(debouncedQuery);
  }, [debouncedQuery, setQuery]);

  const SortByContent = () => (
    <DropdownMenuRadioGroup
      value={sortBy}
      onValueChange={(v) => setSortBy(v as (typeof SORT_OPTIONS)[number])}
    >
      {SORT_OPTIONS.map((option) => (
        <DropdownMenuRadioItem key={option} value={option}>
          {option}
        </DropdownMenuRadioItem>
      ))}
    </DropdownMenuRadioGroup>
  );

  return (
    <TooltipProvider delayDuration={0}>
      <div className="bg-background/80 rounded-lg backdrop-blur-sm">
        <div className="hidden items-center gap-2 lg:flex">
          <div className="relative flex-grow">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search courses..."
              className="pl-9"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-48 flex-shrink-0 justify-between"
              >
                {sortBy} <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <SortByContent />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex gap-2 lg:hidden">
          <div className="relative w-full">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Search courses..."
              className="pl-9"
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="">
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sort By</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="start">
                <SortByContent />
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

export function CourseFiltersSkeleton() {
  return (
    <div className="rounded-lg">
      <div className="hidden items-center gap-2 lg:flex">
        <Skeleton className="h-10 flex-grow" />
        <Skeleton className="h-10 w-44" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="flex gap-2 lg:hidden">
        <Skeleton className="h-8 w-full" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-9" />
          <Skeleton className="h-8 w-9" />
        </div>
      </div>
    </div>
  );
}
