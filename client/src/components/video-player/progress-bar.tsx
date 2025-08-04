"use client";

import { Slider } from "@/components/ui/slider";

const formatTime = (timeInSeconds: number) => {
  const date = new Date(0);
  date.setSeconds(timeInSeconds);

  const timeString = date.toISOString().substr(11, 8);

  if (timeInSeconds < 3600) {
    return timeString.substr(3);
  }

  return timeString;
};

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

export function ProgressBar({
  currentTime,
  duration,
  onSeek,
}: ProgressBarProps) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    onSeek(newTime);
  };

  return (
    <div className="w-full flex flex-col gap-3 text-white group">
      <div className="flex justify-end text-xs px-1 gap-1">
        <span>{formatTime(currentTime)}</span> /
        <span>{formatTime(duration)}</span>
      </div>
      <Slider
        value={[currentTime]}
        max={duration}
        step={1}
        onValueChange={handleSeek}
        className="group/slider h-2 [&_[role=slider]]:slider-thumb [&_[data-slider-track]]:slider-track [&_[data-slider-range]]:slider-range"
      />
    </div>
  );
}
