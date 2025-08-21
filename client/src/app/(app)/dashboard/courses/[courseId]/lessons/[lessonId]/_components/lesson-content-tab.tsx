'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { VideoPlayer } from '@/components/video-player';
import { Eye, Save } from 'lucide-react';

import { LessonSettings, LessonSettingsSkeleton } from './lesson-settings-card';
import {
  VideoPlayerSettings,
  VideoPlayerSettingsSkeleton,
} from './video-player-settings-card';
import { VideoUploader, VideoUploaderSkeleton } from './video-uploader';

export function LessonContentTab() {
  const lessonTitle = 'What is Data Science?';
  const videoSrc = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
  const videoSubtitles = [
    {
      lang: 'en',
      label: 'English',
      src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.en.vtt',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Lesson Content</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Eye className="h-4 w-4" />
                Preview
              </Button>
              <Button>
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="relative">
              <VideoPlayer
                src={videoSrc}
                title={lessonTitle}
                subtitles={videoSubtitles} // Pass the static subtitles
                theaterModeEnabled={true}
              />

              {/* <div className="pointer-events-none absolute top-4 left-4 rounded-md bg-black/60 px-2 py-1 text-sm font-semibold text-white">
                {lessonTitle}
              </div> */}
            </div>

            <Separator className="my-6" />

            <div className="space-y-6">
              <VideoUploader />
              <div>
                <h3 className="text-lg font-semibold">Video Description</h3>
                <Textarea
                  placeholder="Introduction video explaining the fundamentals of data science..."
                  className="mt-2 min-h-24"
                />
              </div>
              <VideoPlayerSettings />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <LessonSettings />
      </div>
    </div>
  );
}

export function LessonContentTabSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>
              <Skeleton className="h-6 w-32" />
            </CardTitle>
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-32" />
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="aspect-video w-full" />
            <Separator className="my-6" />
            <VideoUploaderSkeleton />
            <div className="mt-6">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="mt-2 h-24 w-full" />
            </div>
            <div className="mt-6">
              <VideoPlayerSettingsSkeleton />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <LessonSettingsSkeleton />
      </div>
    </div>
  );
}
