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
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  ArrowUpDown,
  CalendarDays,
  ChevronDown,
  Filter,
  Search,
  Target,
} from 'lucide-react';
import { useState } from 'react';

const SORT_OPTIONS = [
  'Recently Accessed',
  'Progress %',
  'Alphabetical',
  'Rating',
  'Difficulty',
];
const FILTER_OPTIONS = [
  'All Courses',
  'Beginner',
  'Intermediate',
  'Advanced',
  'In Progress',
  'Due Soon',
];

type TSortOption = (typeof SORT_OPTIONS)[number];
type TFilterOption = (typeof FILTER_OPTIONS)[number];

export function CourseFilters() {
  const [sortBy, setSortBy] = useState<TSortOption>('Recently Accessed');
  const [filterBy, setFilterBy] = useState<TFilterOption>('All Courses');

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

  const FilterByContent = () => (
    <>
      <DropdownMenuRadioGroup
        value={filterBy}
        onValueChange={(v) => setFilterBy(v as TFilterOption)}
      >
        {FILTER_OPTIONS.map((option) => (
          <DropdownMenuRadioItem key={option} value={option}>
            {option}
          </DropdownMenuRadioItem>
        ))}
      </DropdownMenuRadioGroup>
    </>
  );

  return (
    <TooltipProvider delayDuration={0}>
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex-shrink-0">
                {filterBy} <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <FilterByContent />
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline">
              <CalendarDays className="h-4 w-4" />
              Schedule
            </Button>
            <Button variant="outline">
              <Target className="h-4 w-4" />
              Goals
            </Button>
          </div>
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

            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filter By</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="start">
                <FilterByContent />
              </DropdownMenuContent>
            </DropdownMenu>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="">
                  <CalendarDays className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Schedule</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="c">
                  <Target className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Goals</p>
              </TooltipContent>
            </Tooltip>
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
        <div className="ml-auto flex items-center gap-2">
          <Skeleton className="h-10 w-28" />
          <Skeleton className="h-10 w-22" />
        </div>
      </div>

      <div className="flex gap-2 lg:hidden">
        <Skeleton className="h-8 w-full" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-9" />
          <Skeleton className="h-8 w-9" />
          <Skeleton className="h-8 w-9" />
          <Skeleton className="h-8 w-9" />
        </div>
      </div>
    </div>
  );
}
