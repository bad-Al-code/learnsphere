'use client';

import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';
import Hls from 'hls.js';
import { Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Controls } from './control';

interface VideoPlayerProps {
  src: string;
}

interface QualityLevel {
  height: number;
  name: string;
  index: number;
}

export function VideoPlayer({ src }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [qualityLevels, setQualityLevels] = useState<QualityLevel[]>([]);
  const [currentQuality, setCurrentQuality] = useState(-1);

  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const videoNode = videoRef.current;
    if (!videoNode) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hlsRef.current = hls;
      hls.attachMedia(videoNode);

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        const levels = data.levels.map((level, index) => ({
          height: level.height,
          name: `${level.height}p`,
          index: index,
        }));
        levels.unshift({ height: 0, name: 'Auto', index: -1 });
        setQualityLevels(levels);
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        setCurrentQuality(data.level);
      });

      hls.loadSource(src);
    } else if (videoNode.canPlayType('application/vnd.apple.mpegurl')) {
      videoNode.src = src;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src]);

  useEffect(() => {
    const videoNode = videoRef.current;
    if (!videoNode) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    videoNode.addEventListener('play', onPlay);
    videoNode.addEventListener('pause', onPause);

    return () => {
      videoNode.removeEventListener('play', onPlay);
      videoNode.removeEventListener('pause', onPause);
    };
  }, []);

  useEffect(() => {
    const videoNode = videoRef.current;
    if (!videoNode) return;

    const onLoadedMetadata = () => {
      setDuration(videoNode.duration);
    };

    const onTimeUpdate = () => {
      setCurrentTime(videoNode.currentTime);
    };

    videoNode.addEventListener('loadedmetadata', onLoadedMetadata);
    videoNode.addEventListener('timeupdate', onTimeUpdate);

    return () => {
      videoNode.removeEventListener('loadedmetadata', onLoadedMetadata);
      videoNode.removeEventListener('timeupdate', onTimeUpdate);
    };
  }, []);

  useEffect(() => {
    const videoNode = videoRef.current;
    if (!videoNode) return;

    const onVolumeChange = () => {
      setVolume(videoNode.volume);
      setIsMuted(videoNode.muted);
    };

    videoNode.addEventListener('volumechange', onVolumeChange);

    return () => {
      videoNode.removeEventListener('volumechange', onVolumeChange);
    };
  }, []);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const handleQualityChange = (levelIndex: number) => {
    if (hlsRef.current) {
      hlsRef.current.nextLevel = levelIndex;
      setCurrentQuality(levelIndex);
    }
  };

  const handleFullscreenToggle = () => {
    const playerContainer = playerContainerRef.current;
    if (!playerContainer) return;

    if (!isFullscreen) {
      if (playerContainer.requestFullscreen) {
        playerContainer.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    const videoNode = videoRef.current;
    if (!videoNode) return;

    videoNode.volume = newVolume;
    setVolume(newVolume);

    if (newVolume > 0 && isMuted) {
      videoNode.muted = false;
      setIsMuted(false);
    }
  };

  const handleMuteToggle = () => {
    const videoNode = videoRef.current;
    if (!videoNode) return;

    videoNode.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (time: number) => {
    const videoNode = videoRef.current;
    if (videoNode) {
      videoNode.currentTime = time;

      setCurrentTime(time);
    }
  };

  const handleTogglePlay = () => {
    const videoNode = videoRef.current;
    if (!videoNode) return;

    if (videoNode.paused) {
      videoNode.play();
    } else {
      videoNode.pause();
    }
  };

  const handleMouseEnter = () => {
    if (isPlaying) setShowControls(true);
  };

  const handleMouseLeave = () => {
    if (isPlaying) setShowControls(false);
  };

  return (
    <div className="group relative w-full" ref={playerContainerRef}>
      <AspectRatio
        ratio={16 / 9}
        className="overflow-hidden rounded-sm bg-black"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleTogglePlay}
      >
        <video
          ref={videoRef}
          controls={false}
          className="h-full w-full rounded-sm"
        />

        <div
          className={cn(
            'pointer-events-none absolute inset-0 flex items-center justify-center bg-black/0 transition-opacity',
            isPlaying ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
          )}
        >
          {!isPlaying && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleTogglePlay();
              }}
              className="pointer-events-auto cursor-pointer rounded-full bg-black/50 p-4 text-white transition-colors hover:bg-black/60"
            >
              <Play size={32} />
            </button>
          )}
        </div>
      </AspectRatio>

      <Controls
        isPlaying={isPlaying}
        volume={volume}
        isMuted={isMuted}
        currentTime={currentTime}
        duration={duration}
        onSeek={handleSeek}
        onVolumeChange={handleVolumeChange}
        onMuteToggle={handleMuteToggle}
        onPlayToggle={handleTogglePlay}
        isFullscreen={isFullscreen}
        onFullscreenToggle={handleFullscreenToggle}
        qualityLevels={qualityLevels}
        currentQuality={currentQuality}
        onQualityChange={handleQualityChange}
      />
    </div>
  );
}
