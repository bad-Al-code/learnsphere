import { RichTextEditor } from '@/components/text-editor';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
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
  control,
  selectedFile,
  onFileSelect,
  isPending,
}: {
  lesson: any;
  control: Control<any>;
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
  isPending: boolean;
}) {
  return (
    <div className="space-y-4">
      {lesson.contentId && (
        <VideoPlayer
          src={lesson.contentId}
          title={lesson.title}
          subtitles={lesson.videoSubtitles}
          theaterModeEnabled={true}
        />
      )}
      <VideoUploader
        selectedFile={selectedFile}
        onFileSelect={onFileSelect}
        disabled={isPending}
      />
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Video Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Add a description for your video lesson..."
                className="min-h-24"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
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
