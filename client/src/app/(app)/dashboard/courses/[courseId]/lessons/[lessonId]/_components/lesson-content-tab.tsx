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
import {
  LessonData,
  QuizLessonContent,
  TextLessonContent,
  VideoLessonContent,
} from './lesson-type-component';

import { Form } from '@/components/ui/form';
import { Progress } from '@/components/ui/progress';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';
import { getLessonVideoUploadUrl, updateLesson } from '../../../../actions';
import { LessonActions, LessonActionsSkeleton } from './lesson-actions';
import {
  LessonSettingsForm,
  LessonSettingsSkeleton,
} from './lesson-settings-card';
import {
  VideoPlayerSettings,
  VideoPlayerSettingsSkeleton,
} from './video-player-settings-card';

const LessonContentRenderer = ({
  lesson,
  form,
}: {
  lesson: LessonData;
  form: any;
}) => {
  switch (lesson.lessonType) {
    case 'text':
      return <TextLessonContent control={form.control} />;
    case 'quiz':
      return <QuizLessonContent lesson={lesson} />;
    default:
      return <div>Unknown lesson type</div>;
  }
};

interface Props {
  lesson: LessonData;
  courseId: string;
}

const textContentSchema = z.object({
  content: z.string().min(15, 'Content must be at least 15 characters.'),
  description: z.string().optional(),
});

export function LessonContentTab({ lesson, courseId }: Props) {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm({
    resolver: zodResolver(textContentSchema),
    defaultValues: {
      content: lesson.textContent?.content || '',
      description: (lesson as any).description || '',
    },
  });

  const { mutate: updateLessonMutation, isPending } = useMutation({
    mutationFn: async (values: { content?: string; description?: string }) => {
      let payload = { ...values };

      if (selectedFile) {
        setUploadProgress(1);
        const urlResult = await getLessonVideoUploadUrl(
          lesson.id,
          selectedFile.name
        );
        if (urlResult.error || !urlResult.data?.signedUrl) {
          throw new Error(urlResult.error || 'Could not get upload URL.');
        }

        await axios.put(urlResult.data.signedUrl, selectedFile, {
          headers: { 'Content-Type': selectedFile.type },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) /
                (progressEvent.total ?? selectedFile.size)
            );
            setUploadProgress(percent);
          },
        });
      }

      if (lesson.lessonType === 'video') {
        delete (payload as any).content;
      } else {
        delete payload.description;
      }

      return updateLesson(courseId, lesson.id, payload);
    },

    onSuccess: () => {
      toast.success('Lesson content saved!');

      queryClient.invalidateQueries({ queryKey: ['lesson', lesson.id] });
      form.reset(form.getValues());
      setSelectedFile(null);
      setUploadProgress(0);
    },

    onError: (error) => {
      toast.error('Failed to save', { description: error.message });
      setUploadProgress(0);
    },
  });

  const onSubmit = (values: { content: string }) => {
    updateLessonMutation(values);
  };

  function handleDuplicate(): void {
    throw new Error('Function not implemented.');
  }

  function handleExport(): void {
    throw new Error('Function not implemented.');
  }

  function handleShare(): void {
    throw new Error('Function not implemented.');
  }

  function handleDelete(): void {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
      <div className="space-y-2 lg:col-span-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <Card className="pt-3">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Lesson Content</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" type="button">
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                  <Button
                    type="submit"
                    disabled={isPending || !form.formState.isDirty}
                  >
                    <Save className="h-4 w-4" />
                    {isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-2">
                <div className="mb-2">
                  <Label htmlFor="lesson-type">Lesson Type</Label>
                  <Select value={lesson.lessonType} disabled>
                    <SelectTrigger id="lesson-type" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">Video Lesson</SelectItem>
                      <SelectItem value="text">Text Lesson</SelectItem>
                      <SelectItem value="quiz">Quiz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {lesson.lessonType === 'video' ? (
                  <VideoLessonContent
                    lesson={lesson}
                    control={form.control}
                    selectedFile={selectedFile}
                    onFileSelect={setSelectedFile}
                    isPending={isPending}
                  />
                ) : (
                  <LessonContentRenderer lesson={lesson} form={form} />
                )}

                {isPending && selectedFile && (
                  <div className="mt-4 space-y-2">
                    <Label>Uploading...</Label>
                    <Progress value={uploadProgress} />
                  </div>
                )}

                <LessonSettingsForm />
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>

      <div className="space-y-2">
        {lesson.lessonType === 'video' && <VideoPlayerSettings />}
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
