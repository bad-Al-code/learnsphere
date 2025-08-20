import { Level } from 'hls.js';
import React from 'react';

export interface TimelineProps {
  progress: number;
  buffered: number;
  onSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
  onHover: (positionX: number, timeFraction: number) => void;
  onMouseLeave: () => void;
}

export type SettingsMenuType = 'main' | 'speed' | 'quality';

export interface SettingsMenuProps {
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
  availableQualities: Level[];
  currentQuality: number;
  onQualityChange: (levelIndex: number) => void;
  currentQualityLabel: string;
}

export interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  progress: number;
  buffered: number;
  duration: number;
  currentTime: number;
  onSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
  volume: number;
  onVolumeChange: (newVolume: number) => void;
  toggleMute: () => void;
  isFullScreen: boolean;
  toggleFullScreen: () => void;
  toggleSettings: () => void;
  toggleSubtitles: () => void;
  areSubtitlesEnabled: boolean;
  toggleTheaterMode: () => void;
  isTheaterMode: boolean;
  toggleMiniPlayer: () => void;
  isVisible: boolean;
  onNext: () => void;
  onPrevious: () => void;
  isAutoplayEnabled: boolean;
  toggleAutoplay: () => void;
}
