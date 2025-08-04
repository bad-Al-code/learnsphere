"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, Settings } from "lucide-react";

interface QualityLevel {
  name: string;
  index: number;
}

interface SettingsControlProps {
  levels: QualityLevel[];
  currentLevel: number;
  onLevelChange: (levelIndex: number) => void;
}

export function SettingsControl({
  levels,
  currentLevel,
  onLevelChange,
}: SettingsControlProps) {
  if (levels.length <= 1) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white">
          <Settings className="w-6 h-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        side="top"
        className="bg-black/80 border-white/20 text-white mb-4"
      >
        {levels.map((level) => (
          <DropdownMenuItem
            key={level.index}
            onClick={() => onLevelChange(level.index)}
            className="cursor-pointer"
          >
            {level.index === currentLevel && <Check className="w-4 h-4 mr-0" />}
            {level.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
