"use client";

import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import Hls from "hls.js";

import { useEffect, useRef } from "react";

interface VideoPlayerProps {
  src: string;
}

export function VideoPlayer({ src }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let hls: Hls | null = null;

    const videoNode = videoRef.current;
    if (!videoNode) return;

    if (Hls.isSupported()) {
      console.log(`Hls.js os supported. Initializing player.`);

      hls = new Hls();
      hls.attachMedia(videoNode);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log(`Manifest parsed. Video ready to play`);
      });
      hls.loadSource(src);
    } else if (videoNode.canPlayType("application/vnd.apple.megaurl")) {
      console.log(`Native HLS support detected.`);

      videoNode.src = src;
    }

    return () => {
      if (hls) {
        console.log(`Destroying Hls.js instance.`);

        hls.destroy();
      }
    };
  }, [src]);

  return (
    <div className="w-full rounded-lg overflow-hidden shadow-2xl/10">
      <AspectRatio ratio={16 / 9} className="bg-muted ">
        <video
          ref={videoRef}
          controls
          className="h-full w-full rounded-lg object-cover dark:brightness-[0.2] dark:grayscale "
        />
      </AspectRatio>
    </div>
  );
}
