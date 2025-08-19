'use client';

import { formatTime } from '@/lib/utils';
import {
  ChevronLeft,
  Maximize,
  Minimize,
  Pause,
  Play,
  Settings,
  Volume1,
  Volume2,
  VolumeX,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

type SettingsMenuType = 'main' | 'speed' | 'quality';

interface SettingsMenuProps {
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
  onClose: () => void;
}

function SettingsMenu({
  playbackSpeed,
  onSpeedChange,
  onClose,
}: SettingsMenuProps) {
  const [activeMenu, setActiveMenu] = useState<SettingsMenuType>('main');

  const handleSpeedSelect = (speed: number) => {
    onSpeedChange(speed);
    setActiveMenu('main'); // Go back to main menu after selection
  };

  return (
    <div className="absolute right-3 bottom-14 z-20 w-48 rounded-lg bg-black/80 p-2 text-sm backdrop-blur-sm">
      {activeMenu === 'main' && (
        <div className="space-y-1">
          <button
            onClick={() => setActiveMenu('quality')}
            className="flex w-full items-center justify-between rounded p-2 hover:bg-white/10"
          >
            <span>Quality</span>
            <span className="text-white/70">1080p &gt;</span>
          </button>
          <button
            onClick={() => setActiveMenu('speed')}
            className="flex w-full items-center justify-between rounded p-2 hover:bg-white/10"
          >
            <span>Playback speed</span>
            <span className="text-white/70">
              {playbackSpeed === 1 ? 'Normal' : `${playbackSpeed}x`} &gt;
            </span>
          </button>
        </div>
      )}

      {activeMenu === 'speed' && (
        <div>
          <button
            onClick={() => setActiveMenu('main')}
            className="mb-2 flex w-full items-center rounded p-2 hover:bg-white/10"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Playback speed
          </button>
          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
            <button
              key={speed}
              onClick={() => handleSpeedSelect(speed)}
              className={`w-full rounded p-2 text-left hover:bg-white/10 ${
                playbackSpeed === speed ? 'bg-white/20' : ''
              }`}
            >
              {speed === 1 ? 'Normal' : `${speed}x`}
            </button>
          ))}
        </div>
      )}

      {activeMenu === 'quality' && (
        <div>
          <button
            onClick={() => setActiveMenu('main')}
            className="mb-2 flex w-full items-center rounded p-2 hover:bg-white/10"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Quality
          </button>
          {['1080p', '720p', '480p', '360p'].map((q) => (
            <button
              key={q}
              className={`w-full rounded p-2 text-left hover:bg-white/10 ${
                q === '1080p' ? 'bg-white/20' : ''
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface PlayerControlsProps {
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  currentTime: number;
  togglePlay: () => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProgressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleFullScreen: () => void;
  isFullScreen: boolean;
  isSettingsOpen: boolean;
  toggleSettings: () => void;
}

function PlayerControls({
  isPlaying,
  volume,
  progress,
  duration,
  currentTime,
  togglePlay,
  onVolumeChange,
  onProgressChange,
  toggleFullScreen,
  isFullScreen,
  isSettingsOpen,
  toggleSettings,
}: PlayerControlsProps) {
  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="absolute right-0 bottom-0 left-0 z-10 flex flex-col bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white opacity-0 transition-opacity group-hover:opacity-100">
      <div className="group/timeline relative w-full cursor-pointer py-1">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={onProgressChange}
          className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/30 transition-transform [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:scale-0 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-600 group-hover/timeline:[&::-webkit-slider-thumb]:scale-100"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={togglePlay}>
            {' '}
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </button>
          <div className="group/volume flex items-center gap-2">
            <button>
              <VolumeIcon className="h-6 w-6" />
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={onVolumeChange}
              className="h-1 w-0 cursor-pointer appearance-none rounded-full bg-white/80 transition-[width] duration-300 ease-in-out group-hover/volume:w-16 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
            />
          </div>
          <div className="text-sm">
            <span>{formatTime(currentTime)}</span> /{' '}
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={toggleSettings}>
            <Settings className="h-6 w-6" />
          </button>

          <button onClick={toggleFullScreen}>
            {isFullScreen ? (
              <Minimize className="h-6 w-6" />
            ) : (
              <Maximize className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseFloat(e.target.value);
    setProgress(newProgress);
    if (videoRef.current) {
      const newTime = (newProgress / 100) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleFullScreen = () => {
    if (!playerContainerRef.current) return;

    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch((err) => {
        alert(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const handlePlaybackSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
    };

    const setVideoDuration = () => {
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', setVideoDuration);
    video.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('loadedmetadata', setVideoDuration);
      video.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, [duration]);

  return (
    <div
      ref={playerContainerRef}
      className="group relative aspect-video w-full overflow-hidden rounded-lg bg-black"
    >
      <video
        ref={videoRef}
        className="h-full w-full"
        src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        onClick={togglePlay}
      >
        <track kind="captions" />
      </video>

      {isSettingsOpen && (
        <SettingsMenu
          playbackSpeed={playbackSpeed}
          onSpeedChange={handlePlaybackSpeedChange}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      <PlayerControls
        isPlaying={isPlaying}
        volume={volume}
        progress={progress}
        duration={duration}
        currentTime={currentTime}
        togglePlay={togglePlay}
        onVolumeChange={handleVolumeChange}
        onProgressChange={handleProgressChange}
        toggleFullScreen={toggleFullScreen}
        isFullScreen={isFullScreen}
        isSettingsOpen={isSettingsOpen}
        toggleSettings={toggleSettings}
      />
    </div>
  );
}
