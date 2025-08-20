import { AppTabs } from '@/components/ui/app-tabs';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { lessonEditorTabs } from '@/config/nav-items';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import {
  LessonContentTab,
  LessonContentTabSkeleton,
} from './_components/lesson-content-tab';

interface LessonEditorPageProps {
  params: { courseId: string; lessonId: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function LessonEditorPage({
  params,
  searchParams,
}: LessonEditorPageProps) {
  const lesson = {
    title: 'What is Data Science?',
    type: 'video',
    duration: '15 min',
  };

  if (!lesson) {
    notFound();
  }

  const tab =
    typeof searchParams.tab === 'string' ? searchParams.tab : 'content';

  return (
    <div className="space-y-2">
      <div>
        <Button asChild variant="ghost" className="-ml-4">
          <Link
            href={`/dashboard/courses/${params.courseId}?tab=content`}
            className="text-muted-foreground flex items-center gap-2 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Content
          </Link>
        </Button>
        <div className="mt-2">
          <h1 className="text-3xl font-bold">{lesson.title}</h1>
          <p className="text-muted-foreground">
            {lesson.type} • {lesson.duration}
          </p>
        </div>
      </div>

      <Tabs value={tab} className="w-full">
        <AppTabs
          tabs={lessonEditorTabs}
          basePath={`/dashboard/courses/${params.courseId}/lessons/${params.lessonId}`}
          activeTab="tab"
        />

        <TabsContent value="content" className="mt-2">
          <Suspense fallback={<LessonContentTabSkeleton />}>
            <LessonContentTab />
          </Suspense>
        </TabsContent>

        <TabsContent value="analytics" className="">
          <p>Lesson Analytics Goes Here...</p>
        </TabsContent>

        <TabsContent value="students" className="">
          <p>Students Progress for this Lesson Goes Here...</p>
        </TabsContent>

        <TabsContent value="comments" className="">
          <p>Comments for this Lesson Goes Here...</p>
        </TabsContent>

        <TabsContent value="settings" className="">
          <p>Lesson Settings Goes Here...</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
