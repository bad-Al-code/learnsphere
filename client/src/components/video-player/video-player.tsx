"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/lib/utils";
import Hls from "hls.js";
import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Controls } from "./control";

interface VideoPlayerProps {
  src: string;
}

export function VideoPlayer({ src }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    let hls: Hls | null = null;
    const videoNode = videoRef.current;
    if (!videoNode) return;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.attachMedia(videoNode);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        // videoNode.play();
      });
      hls.loadSource(src);
    } else if (videoNode.canPlayType("application/vnd.apple.mpegurl")) {
      videoNode.src = src;
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  useEffect(() => {
    const videoNode = videoRef.current;
    if (!videoNode) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    videoNode.addEventListener("play", onPlay);
    videoNode.addEventListener("pause", onPause);

    return () => {
      videoNode.removeEventListener("play", onPlay);
      videoNode.removeEventListener("pause", onPause);
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

    videoNode.addEventListener("loadedmetadata", onLoadedMetadata);
    videoNode.addEventListener("timeupdate", onTimeUpdate);

    return () => {
      videoNode.removeEventListener("loadedmetadata", onLoadedMetadata);
      videoNode.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, []);

  useEffect(() => {
    const videoNode = videoRef.current;
    if (!videoNode) return;

    const onVolumeChange = () => {
      setVolume(videoNode.volume);
      setIsMuted(videoNode.muted);
    };

    videoNode.addEventListener("volumechange", onVolumeChange);

    return () => {
      videoNode.removeEventListener("volumechange", onVolumeChange);
    };
  }, []);

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
    <div className="w-full group relative">
      <AspectRatio
        ratio={16 / 9}
        className="bg-black rounded-sm overflow-hidden "
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleTogglePlay}
      >
        <video ref={videoRef} className="w-full h-full rounded-sm" />

        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-opacity bg-black/10 pointer-events-none",
            isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
          )}
        >
          {!isPlaying && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleTogglePlay();
              }}
              className="p-4 bg-black/50 rounded-full text-white hover:bg-black/60 transition-colors cursor-pointer pointer-events-auto"
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
      />
    </div>
  );
}
