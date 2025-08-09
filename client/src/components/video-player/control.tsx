'use client';

import { cn } from '@/lib/utils';
import { Maximize, Minimize, Pause, Play } from 'lucide-react';
import { Button } from '../ui/button';
import { ProgressBar } from './progress-bar';
import { SettingsControl } from './setting-control';
import { VolumeControl } from './volume-control';

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
        'absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent px-2 pb-1 transition-opacity',
        isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
      )}
    >
      <ProgressBar
        currentTime={currentTime}
        duration={duration}
        onSeek={onSeek}
      />

      <div className="mt-1 flex items-center justify-between">
        {/* Left side controls */}
        <div className="flex cursor-pointer items-center gap-0">
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
        <div className="flex cursor-pointer items-center gap-0">
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
