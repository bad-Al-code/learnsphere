import { cn, formatTime } from '@/lib/utils';
import {
  Maximize,
  Minimize,
  Pause,
  PictureInPicture2,
  Play,
  RectangleHorizontal,
  Repeat,
  Settings,
  SkipBack,
  SkipForward,
  Subtitles,
  Volume1,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import { Timeline } from './Timeline';
import { PlayerControlsProps } from './types';

export function PlayerControls({
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
  onNext,
  isAutoplayEnabled,
  toggleAutoplay,
  onPrevious,
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
                <button onClick={onPrevious} className="cursor-pointer">
                  <SkipBack className="h-6 w-6" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Previous (Shift + P)</TooltipContent>
            </Tooltip>

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
                {isPlaying ? 'Pause (space/k)' : 'Play (space/k)'}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={onNext} className="cursor-pointer">
                  <SkipForward className="h-6 w-6" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Next video (Shift + N)</TooltipContent>
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
                  onClick={toggleAutoplay}
                  className="relative cursor-pointer"
                >
                  <Repeat className="h-6 w-6" />
                  {!isAutoplayEnabled && (
                    <div className="absolute top-1/2 left-0 h-0.5 w-full -rotate-45 rounded-full bg-white" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                {isAutoplayEnabled ? 'Autoplay is on' : 'Autoplay is off'}
              </TooltipContent>
            </Tooltip>

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
