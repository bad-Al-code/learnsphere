'use client';

import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VideoPlayer } from '@/components/video-player';
import { FileText, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { Lesson } from '../schema/course-detail.schema';

interface VideoLessonProps {
  lesson: Lesson;
}

export function VideoLesson({ lesson }: VideoLessonProps) {
  const [activeTab, setActiveTab] = useState<string>('overview');

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <VideoPlayer
          src={lesson.videoUrl}
          title={lesson.title}
          subtitles={lesson.subtitles}
          theaterModeEnabled={false}
        />
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transcript">
            <FileText className="mr-2 h-4 w-4" />
            Transcript
          </TabsTrigger>
          <TabsTrigger value="notes">
            <MessageSquare className="mr-2 h-4 w-4" />
            Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <Card className="p-6">
            <h3 className="mb-2 text-lg font-semibold">About this lesson</h3>
            <p className="text-muted-foreground">{lesson.description}</p>
            {lesson.duration && (
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium">
                  {Math.floor(lesson.duration / 60)} minutes
                </span>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="transcript" className="mt-4">
          <Card className="p-6">
            {lesson.transcript ? (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{lesson.transcript}</p>
              </div>
            ) : (
              <p className="text-muted-foreground py-8 text-center">
                No transcript available for this lesson.
              </p>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
          <Card className="p-6">
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Take notes while watching this lesson. Your notes will be saved
                automatically.
              </p>
              <textarea
                className="bg-background focus:ring-ring min-h-[200px] w-full resize-none rounded-md border p-4 focus:ring-2 focus:outline-none"
                placeholder="Start typing your notes here..."
              />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
