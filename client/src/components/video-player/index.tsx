'use client';

import Hls, { Level } from 'hls.js';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PlayerControls } from './PlayerControls';
import { SettingsMenu } from './SettingsMenu';

export function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hlsRef = useRef<Hls | null>(null);

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
  const [availableQualities, setAvailableQualities] = useState<Level[]>([]);
  const [currentQuality, setCurrentQuality] = useState<number>(-1);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    const hlsStreamUrl = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
    let hls: Hls;

    if (Hls.isSupported()) {
      hls = new Hls();
      hlsRef.current = hls;

      hls.loadSource(hlsStreamUrl);
      hls.attachMedia(videoElement);

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        setAvailableQualities([...data.levels]);
      });
    } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      videoElement.src = hlsStreamUrl;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
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

  const handleNext = () => console.log('Go to next video');
  const handlePrevious = () => console.log('Go to previous video');

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

  const toggleSettings = () => setIsSettingsOpen(!isSettingsOpen);

  const handlePlaybackSpeedChange = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      setIsSettingsOpen(false);
    }
  };

  const toggleSubtitles = () => setAreSubtitlesEnabled(!areSubtitlesEnabled);
  const toggleTheaterMode = () => setIsTheaterMode(!isTheaterMode);
  const toggleMiniPlayer = () => console.log('Mini player toggled');

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

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    inactivityTimerRef.current = setTimeout(() => {
      if (isPlaying && !isSettingsOpen) {
        setAreControlsVisible(false);
      }
    }, 3000);
  }, [isPlaying, isSettingsOpen]);

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

  const handleQualityChange = (levelIndex: number) => {
    if (hlsRef.current) {
      hlsRef.current.currentLevel = levelIndex;
      setCurrentQuality(levelIndex);
    }
    setIsSettingsOpen(false);
  };

  const currentQualityLabel =
    currentQuality === -1
      ? `Auto (${
          hlsRef.current?.levels[hlsRef.current?.currentLevel]?.height ?? '...'
        }p)`
      : `${availableQualities[currentQuality]?.height}p`;

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
      if (e.key === 'Escape') setIsSettingsOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        playerContainerRef.current &&
        !playerContainerRef.current.contains(e.target as Node)
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
  }, [isPlaying, isSettingsOpen, resetInactivityTimer]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'k':
        case 'K':
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
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    togglePlay,
    toggleMute,
    toggleFullScreen,
    toggleSubtitles,
    toggleTheaterMode,
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
        playsInline
        onClick={togglePlay}
        onDoubleClick={toggleFullScreen}
      >
        <track kind="captions" />
      </video>

      {isSettingsOpen && (
        <SettingsMenu
          playbackSpeed={playbackSpeed}
          onSpeedChange={handlePlaybackSpeedChange}
          availableQualities={availableQualities}
          currentQuality={currentQuality}
          onQualityChange={handleQualityChange}
          currentQualityLabel={currentQualityLabel}
        />
      )}

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
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </div>
  );
}
