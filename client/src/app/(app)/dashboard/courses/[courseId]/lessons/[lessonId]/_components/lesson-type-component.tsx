import { RichTextEditor } from '@/components/text-editor';
import { Textarea } from '@/components/ui/textarea';
import { VideoPlayer } from '@/components/video-player';
import { useState } from 'react';
import { VideoUploader } from './video-uploader';

export type LessonType = 'video' | 'text' | 'quiz';

export interface LessonData {
  id: string;
  title: string;
  type: LessonType;
  videoSrc?: string;
  textContent?: string;
  videoSubtitles?: {
    lang: string;
    label: string;
    src: string;
  }[];
}

export function VideoLessonContent({ lesson }: { lesson: LessonData }) {
  if (!lesson.videoSrc) {
    return (
      <div className="rounded-md border-2 border-dashed p-4 text-center">
        Please provide a video source.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <VideoPlayer
        src={lesson.videoSrc}
        title={lesson.title}
        subtitles={lesson.videoSubtitles}
        theaterModeEnabled={true}
      />
      <VideoUploader />
      <div>
        <h3 className="text-lg font-semibold">Video Description</h3>
        <Textarea
          placeholder="Add a description for your video lesson..."
          className="mt-2 min-h-24"
        />
      </div>
    </div>
  );
}

export function TextLessonContent({ lesson }: { lesson: LessonData }) {
  const [content, setContent] = useState(lesson.textContent || '');
  return (
    <div>
      <RichTextEditor
        initialContent={content}
        onChange={(newContent) => setContent(newContent)}
      />
    </div>
  );
}

export function QuizLessonContent({ lesson }: { lesson: LessonData }) {
  return (
    <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
      <p className="text-muted-foreground">Quiz Builder UI will go here.</p>
    </div>
  );
}
