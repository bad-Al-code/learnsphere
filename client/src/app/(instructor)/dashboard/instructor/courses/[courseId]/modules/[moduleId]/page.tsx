import { ArrowLeft, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getModuleDetails } from '../../actions';
import { ModulesSkeleton as LessonSkeleton } from '../../content/_components/module-skeleton';
import { LessonsList } from './_components/lessons-list';

interface ModuleDetailPageProps {
  params: { courseId: string; moduleId: string };
}

export default function ModuleDetailPage({ params }: ModuleDetailPageProps) {
  return (
    <div>
      <Link
        href={`/dashboard/instructor/courses/${params.courseId}/content`}
        className="text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-2 text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Course Content
      </Link>

      <Suspense fallback={<LessonSkeleton />}>
        <ModuleContent params={params} />
      </Suspense>
    </div>
  );
}

async function ModuleContent({ params }: ModuleDetailPageProps) {
  const module = await getModuleDetails(params.moduleId);
  if (!module) notFound();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{module.title}</CardTitle>
          <CardDescription>Manage the lessons for this module.</CardDescription>
        </div>
        <Button asChild>
          <Link
            href={`/dashboard/instructor/courses/${params.courseId}/modules/${params.moduleId}/lessons/create`}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add a lesson
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <LessonsList
          initialLessons={module.lessons}
          courseId={params.courseId}
          moduleId={module.id}
        />
      </CardContent>
    </Card>
  );
}
