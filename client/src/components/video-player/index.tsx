'use client';

import { cn, formatTime } from '@/lib/utils';
import Hls from 'hls.js';
import {
  ChevronLeft,
  Maximize,
  Minimize,
  Pause,
  PictureInPicture2,
  Play,
  RectangleHorizontal,
  Settings,
  SkipForward,
  Subtitles,
  Volume1,
  Volume2,
  VolumeX,
} from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

interface TimelineProps {
  progress: number;
  buffered: number;
  onSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
}

function Timeline({ progress, buffered, onSeek }: TimelineProps) {
  return (
    <div
      onClick={onSeek}
      className="group/timeline relative h-2.5 w-full cursor-pointer"
    >
      <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-white/30" />
      <div
        className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/30"
        style={{ width: `${buffered}%` }}
      />
      <div
        className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-white"
        style={{ width: `${progress}%` }}
      />
      <div
        className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white transition-transform group-hover/timeline:scale-100"
        style={{ left: `${progress}%` }}
      />
    </div>
  );
}

type SettingsMenuType = 'main' | 'speed' | 'quality';

interface SettingsMenuProps {
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
}

function SettingsMenu({ playbackSpeed, onSpeedChange }: SettingsMenuProps) {
  const [activeMenu, setActiveMenu] = useState<SettingsMenuType>('main');

  const handleSpeedSelect = (speed: number) => {
    onSpeedChange(speed);
    setActiveMenu('main');
  };

  return (
    <div className="absolute right-3 bottom-14 z-20 w-52 overflow-hidden rounded-lg border border-white/10 bg-black/80 text-sm text-white shadow-lg backdrop-blur-lg">
      {activeMenu === 'main' && (
        <div className="flex flex-col">
          <button
            onClick={() => setActiveMenu('quality')}
            className="flex w-full cursor-pointer items-center justify-between px-3 py-2 hover:bg-white/10"
          >
            <span>Quality</span>
            <span className="text-white/70">1080p &gt;</span>
          </button>

          <button
            onClick={() => setActiveMenu('speed')}
            className="flex w-full cursor-pointer items-center justify-between px-3 py-2 hover:bg-white/10"
          >
            <span>Playback speed</span>
            <span className="text-white/70">
              {playbackSpeed === 1 ? 'Normal' : `${playbackSpeed}x`} &gt;
            </span>
          </button>
        </div>
      )}

      {activeMenu === 'speed' && (
        <div className="flex flex-col">
          <button
            onClick={() => setActiveMenu('main')}
            className="flex cursor-pointer items-center px-3 py-2 hover:bg-white/10"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Playback speed
          </button>
          {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
            <button
              key={speed}
              onClick={() => handleSpeedSelect(speed)}
              className={`cursor-pointer px-3 py-2 text-left hover:bg-white/10 ${
                playbackSpeed === speed ? 'bg-white/20 font-semibold' : ''
              }`}
            >
              {speed === 1 ? 'Normal' : `${speed}x`}
            </button>
          ))}
        </div>
      )}

      {activeMenu === 'quality' && (
        <div className="flex flex-col">
          <button
            onClick={() => setActiveMenu('main')}
            className="flex cursor-pointer items-center px-3 py-2 hover:bg-white/10"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Quality
          </button>
          {['1080p', '720p', '480p', '360p'].map((q) => (
            <button
              key={q}
              className={`cursor-pointer px-3 py-2 text-left hover:bg-white/10 ${
                q === '1080p' ? 'bg-white/20 font-semibold' : ''
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
}

function PlayerControls({
  isPlaying,
  onPlayPause,
  progress,
  buffered,
  duration,
  currentTime,
  onSeek,
  volume,
  onVolumeChange,
  toggleMute,
  isFullScreen,
  toggleFullScreen,
  toggleSettings,
  toggleSubtitles,
  areSubtitlesEnabled,
  toggleTheaterMode,
  isTheaterMode,
  toggleMiniPlayer,
  isVisible,
}: PlayerControlsProps) {
  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={cn(
          'absolute right-0 bottom-0 left-0 z-10 flex flex-col bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white transition-opacity',
          isVisible ? 'opacity-100' : 'opacity-0'
        )}
      >
        <Timeline progress={progress} buffered={buffered} onSeek={onSeek} />
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={onPlayPause} className="cursor-pointer">
                  {isPlaying ? (
                    <Pause className="h-6 w-6" />
                  ) : (
                    <Play className="h-6 w-6" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                {isPlaying ? 'Pause (space)' : 'Play (space)'}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button className="cursor-pointer">
                  <SkipForward className="h-6 w-6" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Next video</TooltipContent>
            </Tooltip>

            <div className="group/volume flex items-center gap-0 hover:gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="cursor-pointer" onClick={toggleMute}>
                    <VolumeIcon className="h-6 w-6" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {volume > 0 ? 'Mute (m)' : 'Unmute (m)'}
                </TooltipContent>
              </Tooltip>

              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="h-1 w-0 cursor-pointer appearance-none rounded-full bg-white/80 opacity-0 transition-all duration-300 ease-in-out group-hover/volume:w-20 group-hover/volume:opacity-100 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
              />
            </div>

            <div className="text-sm">
              <span>{formatTime(currentTime)}</span> /{' '}
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleSubtitles}
                  className="relative cursor-pointer"
                >
                  <Subtitles className="h-6 w-6" />
                  {areSubtitlesEnabled && (
                    <div className="absolute bottom-0 left-1/2 h-0.5 w-4/5 -translate-x-1/2 rounded-full bg-black" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>Subtitles (c)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={toggleSettings} className="cursor-pointer">
                  <Settings className="h-6 w-6" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Settings</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={toggleMiniPlayer} className="cursor-pointer">
                  <PictureInPicture2 className="h-6 w-6" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Miniplayer (i)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={toggleTheaterMode} className="cursor-pointer">
                  <RectangleHorizontal className="h-6 w-6" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Theater mode (t)</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={toggleFullScreen} className="cursor-pointer">
                  {isFullScreen ? (
                    <Minimize className="h-6 w-6" />
                  ) : (
                    <Maximize className="h-6 w-6" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                {isFullScreen ? 'Exit full screen (f)' : 'Full screen (f)'}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

export function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [lastVolume, setLastVolume] = useState(0.5);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [areSubtitlesEnabled, setAreSubtitlesEnabled] = useState(false);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [areControlsVisible, setAreControlsVisible] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    const hlsStreamUrl = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
    let hls: Hls;

    if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        // backBufferLength: 90
      });

      hls.loadSource(hlsStreamUrl);
      hls.attachMedia(videoElement);
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      videoElement.src = hlsStreamUrl;
    }
    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
        setCurrentTime(video.currentTime);
      }
    };

    const handleProgress = () => {
      if (video.buffered.length > 0 && video.duration) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        setBuffered((bufferedEnd / video.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('progress', handleProgress);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', () => setIsPlaying(false));
    video.addEventListener('play', () => setIsPlaying(true));
    video.addEventListener('pause', () => setIsPlaying(false));

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('progress', handleProgress);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', () => setIsPlaying(false));
      video.removeEventListener('play', () => setIsPlaying(true));
      video.removeEventListener('pause', () => setIsPlaying(false));
    };
  }, []);

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      isPlaying ? videoRef.current.pause() : videoRef.current.play();
    }
  }, [isPlaying]);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current) {
      const timeline = e.currentTarget;
      const rect = timeline.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const seekFraction = clickX / rect.width;
      const seekTime = seekFraction * duration;

      videoRef.current.currentTime = seekTime;
      setProgress(seekFraction * 100);
      setCurrentTime(seekTime);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    if (videoRef.current) videoRef.current.volume = clampedVolume;
  };

  const toggleMute = useCallback(() => {
    if (volume > 0) {
      setLastVolume(volume);
      setVolume(0);
      if (videoRef.current) videoRef.current.volume = 0;
    } else {
      setVolume(lastVolume);
      if (videoRef.current) videoRef.current.volume = lastVolume;
    }
  }, [volume, lastVolume]);

  const toggleFullScreen = () => {
    const playerContainer = playerContainerRef.current;
    if (!playerContainer) return;

    if (!document.fullscreenElement) {
      playerContainer.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    } else {
      document.exitFullscreen();
    }
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const handlePlaybackSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      setIsSettingsOpen(false);
    }
  };

  const toggleSubtitles = () => {
    setAreSubtitlesEnabled(!areSubtitlesEnabled);
    console.log('Subtitles toggled');
  };

  const toggleTheaterMode = () => {
    setIsTheaterMode(!isTheaterMode);
    console.log('Theater mode toggled');
  };

  const toggleMiniPlayer = () => {
    console.log('Mini player toggled');
  };

  const seekRelative = useCallback(
    (delta: number) => {
      if (videoRef.current) {
        const newTime = videoRef.current.currentTime + delta;
        videoRef.current.currentTime = Math.max(0, Math.min(duration, newTime));
      }
    },
    [duration]
  );

  const seekToPercentage = useCallback(
    (percentage: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = duration * (percentage / 100);
      }
    },
    [duration]
  );

  const resetInactivityTimer = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    inactivityTimerRef.current = setTimeout(() => {
      if (isPlaying && !isSettingsOpen) {
        setAreControlsVisible(false);
      }
    }, 3000);
  };

  const handleMouseMove = () => {
    setAreControlsVisible(true);
    resetInactivityTimer();
  };

  const handleMouseLeave = () => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (isPlaying && !isSettingsOpen) {
      setAreControlsVisible(false);
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
  }, []);

  useEffect(() => {
    if (!isSettingsOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSettingsOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const menu = document.getElementById('settings-menu');
      const settingsButton = document.getElementById('settings-button');
      if (
        menu &&
        !menu.contains(e.target as Node) &&
        settingsButton &&
        !settingsButton.contains(e.target as Node)
      ) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSettingsOpen]);

  useEffect(() => {
    if (isPlaying) {
      resetInactivityTimer();
    } else {
      setAreControlsVisible(true);
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    }
  }, [isPlaying, isSettingsOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'm':
        case 'M':
          toggleMute();
          break;
        case 'f':
        case 'F':
          toggleFullScreen();
          break;
        case 'c':
        case 'C':
          toggleSubtitles();
          break;
        case 't':
        case 'T':
          toggleTheaterMode();
          break;
        case 'i':
        case 'I':
          toggleMiniPlayer();
          break;
        case 'ArrowRight':
          seekRelative(5);
          break;
        case 'ArrowLeft':
          seekRelative(-5);
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleVolumeChange(volume + 0.05);
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleVolumeChange(volume - 0.05);
          break;

        case '1':
          seekToPercentage(10);
          break;
        case '2':
          seekToPercentage(20);
          break;
        case '3':
          seekToPercentage(30);
          break;
        case '4':
          seekToPercentage(40);
          break;
        case '5':
          seekToPercentage(50);
          break;
        case '6':
          seekToPercentage(60);
          break;
        case '7':
          seekToPercentage(70);
          break;
        case '8':
          seekToPercentage(80);
          break;
        case '9':
          seekToPercentage(90);
          break;
        case '0':
          seekToPercentage(0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    togglePlay,
    toggleMute,
    toggleFullScreen,
    seekRelative,
    seekToPercentage,
    volume,
    handleVolumeChange,
  ]);

  return (
    <div
      ref={playerContainerRef}
      className="group relative aspect-video w-full overflow-hidden rounded-lg bg-black focus:outline-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
    >
      <video
        ref={videoRef}
        className="h-full w-full"
        muted
        playsInline
        onClick={togglePlay}
        onDoubleClick={toggleFullScreen}
      >
        <track kind="captions" />
      </video>

      {isSettingsOpen && (
        <div id="settings-menu">
          <SettingsMenu
            playbackSpeed={playbackSpeed}
            onSpeedChange={handlePlaybackSpeedChange}
          />
        </div>
      )}
      <button
        id="settings-button"
        onClick={toggleSettings}
        className="cursor-pointer transition-transform duration-300"
      >
        <Settings className="h-6 w-6" />
      </button>

      <PlayerControls
        isPlaying={isPlaying}
        onPlayPause={togglePlay}
        progress={progress}
        buffered={buffered}
        duration={duration}
        currentTime={currentTime}
        onSeek={handleSeek}
        volume={volume}
        onVolumeChange={handleVolumeChange}
        toggleMute={toggleMute}
        isFullScreen={isFullScreen}
        toggleFullScreen={toggleFullScreen}
        toggleSettings={toggleSettings}
        toggleSubtitles={toggleSubtitles}
        areSubtitlesEnabled={areSubtitlesEnabled}
        toggleTheaterMode={toggleTheaterMode}
        isTheaterMode={isTheaterMode}
        toggleMiniPlayer={toggleMiniPlayer}
        isVisible={areControlsVisible}
      />
    </div>
  );
}
