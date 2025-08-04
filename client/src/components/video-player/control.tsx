"use client";

import { cn } from "@/lib/utils";
import { Maximize, Minimize, Pause, Play } from "lucide-react";
import { Button } from "../ui/button";
import { ProgressBar } from "./progress-bar";
import { SettingsControl } from "./setting-control";
import { VolumeControl } from "./volume-control";

interface QualityLevel {
  name: string;
  index: number;
}

interface ControlsProps {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  onPlayToggle: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
  isFullscreen: boolean;
  onFullscreenToggle: () => void;
  qualityLevels: QualityLevel[];
  currentQuality: number;
  onQualityChange: (levelIndex: number) => void;
}

export function Controls({
  isPlaying,
  volume,
  isMuted,
  currentTime,
  duration,
  onSeek,
  onPlayToggle,
  onVolumeChange,
  onMuteToggle,
  isFullscreen,
  onFullscreenToggle,
  qualityLevels,
  currentQuality,
  onQualityChange,
}: ControlsProps) {
  return (
    <div
      className={cn(
        "absolute bottom-0 left-0 right-0 px-2 pb-1 bg-gradient-to-t from-black/60 to-transparent transition-opacity ",
        isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
      )}
    >
      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        onSeek={onSeek}
      />

      <div className="flex items-center justify-between mt-1">
        {/* Left side controls */}
        <div className="flex items-center gap-0 cursor-pointer">
          <Button
            onClick={onPlayToggle}
            variant="ghost"
            size="icon"
            className="text-white"
          >
            {isPlaying ? <Pause /> : <Play />}
          </Button>
          <VolumeControl
            volume={volume}
            isMuted={isMuted}
            onVolumeChange={onVolumeChange}
            onMuteToggle={onMuteToggle}
          />
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-0 cursor-pointer">
          <SettingsControl
            levels={qualityLevels}
            currentLevel={currentQuality}
            onLevelChange={onQualityChange}
          />
          <Button
            onClick={onFullscreenToggle}
            variant="ghost"
            size="icon"
            className="text-white"
          >
            {isFullscreen ? (
              <Minimize className="h-6 w-6" />
            ) : (
              <Maximize className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
