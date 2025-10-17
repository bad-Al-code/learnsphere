'use-client';

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
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ArrowUpDown, ChevronDown, Search } from 'lucide-react';
import { useState } from 'react';

const SORT_OPTIONS = ['Recently Accessed', 'Progress %', 'Alphabetical'];

type TSortOption = (typeof SORT_OPTIONS)[number];

export function CourseFilters() {
  const [sortBy, setSortBy] = useState<TSortOption>('Recently Accessed');

  const SortByContent = () => (
    <>
      <DropdownMenuRadioGroup
        value={sortBy}
        onValueChange={(v) => setSortBy(v as TSortOption)}
      >
        {SORT_OPTIONS.map((option) => (
          <DropdownMenuRadioItem key={option} value={option}>
            {option}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuRadioGroup>
    </>
  );

  return (
    <div className="bg-background/80 rounded-lg backdrop-blur-sm">
      <div className="hidden items-center gap-2 lg:flex">
        <div className="relative flex-grow">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input placeholder="Search courses..." className="pl-9" />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex-shrink-0">
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
          <Input placeholder="Search courses..." className="pl-9" />
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
