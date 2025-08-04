"use client";

import { Slider } from "@/components/ui/slider";
import { Volume1, Volume2, VolumeX } from "lucide-react";
import { Button } from "../ui/button";

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
}

export function VolumeControl({
  volume,
  isMuted,
  onVolumeChange,
  onMuteToggle,
}: VolumeControlProps) {
  const VolumeIcon =
    isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  const handleSliderChange = (value: number[]) => {
    onVolumeChange(value[0] / 100);
  };

  return (
    <div className="flex items-center gap-1 group/volume cursor-pointer">
      <Button
        variant="ghost"
        onClick={onMuteToggle}
        className="text-white cursor-pointer"
      >
        <VolumeIcon className="w-6 h-6" />
      </Button>
      <div className="w-24 opacity-0 group-hover/volume:opacity-100 transition-opacity">
        <Slider
          value={[isMuted ? 0 : volume * 100]}
          max={100}
          step={1}
          onValueChange={handleSliderChange}
          className=""
        />
      </div>
    </div>
  );
}
