"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { COURSE_LEVELS } from "@/types/course";
import { SlidersHorizontal } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function DifficultyFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLevel = searchParams.get("level") || "all";

  const handleSelect = (level: string) => {
    const params = new URLSearchParams(searchParams);
    if (level !== "all") {
      params.set("level", level);
    } else {
      params.delete("level");
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="secondary"
              className=" border text-sm px-3 h-6"
              aria-label="Filter by difficulty"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          >
            {COURSE_LEVELS.map((level) => (
              <DropdownMenuItem
                key={level.value}
                onClick={() => handleSelect(level.value)}
                className={currentLevel === level.value ? "font-semibold" : ""}
              >
                {level.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipTrigger>
      <TooltipContent>Filter by difficulty</TooltipContent>
    </Tooltip>
  );
}
