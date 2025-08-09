'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Check, Settings } from 'lucide-react';

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
          <Settings className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        side="top"
        className="mb-4 border-white/20 bg-black/80 text-white"
      >
        {levels.map((level) => (
          <DropdownMenuItem
            key={level.index}
            onClick={() => onLevelChange(level.index)}
            className="cursor-pointer"
          >
            {level.index === currentLevel && <Check className="mr-0 h-4 w-4" />}
            {level.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
