'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';
import type { Lesson } from '../../schema/course-detail.schema';

interface AudioLessonProps {
  lesson: Lesson;
}

export function AudioLesson({ lesson }: AudioLessonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState('1');
  const [currentTime, setCurrentTime] = useState(0);

  return (
    <div className="space-y-4">
      {/* Audio Player */}
      <div className="from-primary/10 to-primary/5 rounded-lg bg-gradient-to-br p-8">
        <div className="flex flex-col items-center gap-6">
          <div className="text-6xl">🎧</div>
          <div className="text-center">
            <h3 className="text-foreground font-semibold">{lesson.title}</h3>
            <p className="text-muted-foreground text-sm">
              {lesson.duration} minutes
            </p>
          </div>

          {/* Audio Controls */}
          <div className="w-full space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="bg-muted h-2 w-full rounded-full">
                <div
                  className="bg-primary h-full rounded-full transition-all"
                  style={{ width: `${(currentTime / lesson.duration) * 100}%` }}
                />
              </div>
              <div className="text-muted-foreground flex justify-between text-xs">
                <span>{Math.floor(currentTime)}:00</span>
                <span>{lesson.duration}:00</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-4">
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-12 rounded-full bg-transparent"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? '⏸' : '▶'}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
              <Select value={playbackSpeed} onValueChange={setPlaybackSpeed}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">0.5x</SelectItem>
                  <SelectItem value="1">1x</SelectItem>
                  <SelectItem value="1.5">1.5x</SelectItem>
                  <SelectItem value="2">2x</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Transcript */}
      {lesson.transcript && (
        <div className="bg-muted space-y-3 rounded-lg p-4">
          <h3 className="text-foreground font-semibold">Transcript</h3>
          <ScrollArea className="h-48">
            <p className="text-muted-foreground pr-4 text-sm leading-relaxed">
              {lesson.transcript}
            </p>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
