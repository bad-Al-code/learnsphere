"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import Hls from "hls.js";
import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface VideoPlayerProps {
  src: string;
}

export function VideoPlayer({ src }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);

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
    <div className="w-full group">
      <AspectRatio
        ratio={16 / 9}
        className=" rounded-sm overflow-hidden relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <video ref={videoRef} className="w-full h-full rounded-sm" />

        <div className="absolute inset-0 " onClick={handleTogglePlay}>
          {(showControls || !isPlaying) && (
            <div className="absolute inset-0 flex items-center justify-center bg-opacity-90 transition-opacity">
              <button className="p-4 bg-black/50 rounded-full text-white hover:bg-black/60 transition-colors  cursor-pointer">
                {isPlaying ? <Pause size={32} /> : <Play size={32} />}
              </button>
            </div>
          )}
        </div>
      </AspectRatio>
    </div>
  );
}
