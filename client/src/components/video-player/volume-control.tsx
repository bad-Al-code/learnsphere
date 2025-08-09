'use client';

import { Slider } from '@/components/ui/slider';
import { Volume1, Volume2, VolumeX } from 'lucide-react';
import { Button } from '../ui/button';

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
    <div className="group/volume flex cursor-pointer items-center gap-1">
      <Button
        variant="ghost"
        onClick={onMuteToggle}
        className="cursor-pointer text-white"
      >
        <VolumeIcon className="h-6 w-6" />
      </Button>
      <div className="w-24 opacity-0 transition-opacity group-hover/volume:opacity-100">
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
