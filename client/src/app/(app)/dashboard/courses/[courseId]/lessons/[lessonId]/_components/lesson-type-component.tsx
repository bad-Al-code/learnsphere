import { RichTextEditor } from '@/components/text-editor';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { VideoPlayer } from '@/components/video-player';
import { Control } from 'react-hook-form';
import { VideoUploader } from './video-uploader';

export type LessonType = 'video' | 'text' | 'quiz';

export interface LessonData {
  id: string;
  title: string;
  lessonType: LessonType;
  contentId?: string;
  textContent?: { content: string } | null;
  videoSubtitles?: {
    lang: string;
    label: string;
    src: string;
  }[];
}

export function VideoLessonContent({
  lesson,
}: {
  lesson: { videoSrc?: string; title: string; videoSubtitles?: any[] };
}) {
  if (!lesson.videoSrc) {
    return <VideoUploader />;
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

export function TextLessonContent({ control }: { control: Control<any> }) {
  return (
    <FormField
      control={control}
      name="content"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <RichTextEditor
              initialContent={field.value}
              onChange={field.onChange}
            />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
export function QuizLessonContent({ lesson }: { lesson: LessonData }) {
  return (
    <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed">
      <p className="text-muted-foreground">Quiz Builder UI will go here.</p>
    </div>
  );
}
