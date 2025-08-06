"use client";

import { serachCourseForCommand } from "@/app/courses/actions";
import { BookOpen, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { Button } from "../ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

type CourseSearchResult = {
  id: string;
  title: string;
};

export function SearchBar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [debounceQuery] = useDebounce(query, 300);
  const [results, setResults] = useState<CourseSearchResult[]>([]);

  useEffect(() => {
    if (debounceQuery.length > 1) {
      setIsLoading(true);

      serachCourseForCommand(debounceQuery).then((res) => {
        if (res.success && res.data) {
          setResults(res.data);
        } else {
          setResults([]);
        }

        setIsLoading(false);
      });
    }
  }, [debounceQuery]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (courseId: string) => {
    setIsOpen(false);
    router.push(`/courses/${courseId}`);
  };

  return (
    <>
      {/* Mobile/Tablet: Just Icon Button */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(true)}
              className="md:hidden"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Search Courses</p>
        </TooltipContent>
      </Tooltip>

      {/* Desktop and Up: Full Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="hidden md:flex w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
      >
        <Search className="h-4 w-4 mr-1" />
        <span className="hidden lg:inline-flex">Search courses...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="ml-auto bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      {/* Search Command Dialog */}
      <CommandDialog
        className="border-2"
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <CommandInput
          placeholder="Type a course title to search..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {isLoading && <div className="p-4 text-sm">Searching...</div>}
          {!isLoading && !results.length && debounceQuery.length > 1 && (
            <CommandEmpty>No results found.</CommandEmpty>
          )}
          <CommandGroup heading="Courses">
            {results.map((course) => (
              <CommandItem
                key={course.id}
                value={course.title}
                onSelect={() => handleSelect(course.id)}
                className="cursor-pointer"
              >
                <BookOpen className="mr-1 h-4 w-4" />
                <span>{course.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
