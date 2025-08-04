"use client";

import { cn } from "@/lib/utils";
import { ProgressBar } from "./progress-bar";
import { VolumeControl } from "./volume-control";

interface ControlsProps {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
}

export function Controls({
  isPlaying,
  volume,
  isMuted,
  currentTime,
  duration,
  onSeek,
  onVolumeChange,
  onMuteToggle,
}: ControlsProps) {
  return (
    <div
      className={cn(
        "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent transition-opacity",
        isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
      )}
    >
      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        onSeek={onSeek}
      />
      <div className="flex items-center justify-between mt-2">
        <VolumeControl
          volume={volume}
          isMuted={isMuted}
          onVolumeChange={onVolumeChange}
          onMuteToggle={onMuteToggle}
        />
      </div>
    </div>
  );
}
