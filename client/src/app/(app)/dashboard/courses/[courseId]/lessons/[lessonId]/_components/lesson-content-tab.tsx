'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Eye, Save } from 'lucide-react';
import { useState } from 'react';
import {
  LessonData,
  LessonType,
  QuizLessonContent,
  TextLessonContent,
  VideoLessonContent,
} from './lesson-type-component';

import { LessonActions, LessonActionsSkeleton } from './lesson-actions';
import { LessonSettings, LessonSettingsSkeleton } from './lesson-settings-card';
import {
  VideoPlayerSettings,
  VideoPlayerSettingsSkeleton,
} from './video-player-settings-card';

const LessonContentRenderer = ({ lesson }: { lesson: LessonData }) => {
  switch (lesson.type) {
    case 'video':
      return <VideoLessonContent lesson={lesson} />;
    case 'text':
      return <TextLessonContent lesson={lesson} />;
    case 'quiz':
      return <QuizLessonContent lesson={lesson} />;
    default:
      return <div>Unknown lesson type</div>;
  }
};

export function LessonContentTab() {
  const [currentLesson, setCurrentLesson] = useState<LessonData>({
    id: 'lesson-1',
    title: 'What is Data Science?',
    type: 'text',
    videoSrc: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    textContent: '<h2>Start writing your text lesson here!</h2>',
    videoSubtitles: [
      {
        lang: 'en',
        label: 'English',
        src: 'https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.en.vtt',
      },
    ],
  });

  const handleLessonTypeChange = (newType: LessonType) => {
    setCurrentLesson((prevLesson) => ({
      ...prevLesson,
      type: newType,
    }));
  };

  const handleDuplicate = () => alert('Duplicate clicked!');
  const handleExport = () => alert('Export clicked!');
  const handleShare = () => alert('Share clicked!');
  const handleDelete = () => alert('Deleting lesson...');

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
      <div className="space-y-2 lg:col-span-2">
        <Card className="pt-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Lesson Content</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Eye className="mr-1 h-4 w-4" />
                Preview
              </Button>
              <Button>
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="mb-2">
              <Label htmlFor="lesson-type">Lesson Type</Label>
              <Select
                value={currentLesson.type}
                onValueChange={(value: LessonType) =>
                  handleLessonTypeChange(value)
                }
              >
                <SelectTrigger id="lesson-type" className="mt-2">
                  <SelectValue placeholder="Select a lesson type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video Lesson</SelectItem>
                  <SelectItem value="text">Text Lesson</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <LessonContentRenderer lesson={currentLesson} />
          </CardContent>
        </Card>
      </div>
      <div className="space-y-2">
        <LessonSettings />
        {currentLesson.type === 'video' && <VideoPlayerSettings />}
        <LessonActions
          onDuplicate={handleDuplicate}
          onExport={handleExport}
          onShare={handleShare}
          onDelete={handleDelete}
        />
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
            <div className="mt-6">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="mt-2 h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <LessonSettingsSkeleton />
        <VideoPlayerSettingsSkeleton />
        <LessonActionsSkeleton />
      </div>
    </div>
  );
}
