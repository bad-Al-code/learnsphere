'use client';

import { formatTime } from '@/lib/utils';
import Hls from 'hls.js';
import { Pause, Play } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

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

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  progress: number;
  buffered: number;
  duration: number;
  currentTime: number;
  onSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
}

function PlayerControls({
  isPlaying,
  onPlayPause,
  progress,
  buffered,
  duration,
  currentTime,
  onSeek,
}: PlayerControlsProps) {
  return (
    <div className="absolute right-0 bottom-0 left-0 z-10 flex flex-col bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-white opacity-0 transition-opacity group-hover:opacity-100">
      <Timeline progress={progress} buffered={buffered} onSeek={onSeek} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onPlayPause}>
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </button>
          <div className="text-sm">
            <span>{formatTime(currentTime)}</span> /{' '}
            <span>{formatTime(duration)}</span>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}

export function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [progress, setProgress] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    const hlsStreamUrl = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
    let hls: Hls;
    if (Hls.isSupported()) {
      hls = new Hls();
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

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

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

  return (
    <div className="group relative aspect-video w-full overflow-hidden rounded-lg bg-black">
      <video
        ref={videoRef}
        className="h-full w-full"
        muted
        playsInline
        onClick={togglePlay}
      >
        <track kind="captions" />
      </video>

      <PlayerControls
        isPlaying={isPlaying}
        onPlayPause={togglePlay}
        progress={progress}
        buffered={buffered}
        duration={duration}
        currentTime={currentTime}
        onSeek={handleSeek}
      />
    </div>
  );
}
