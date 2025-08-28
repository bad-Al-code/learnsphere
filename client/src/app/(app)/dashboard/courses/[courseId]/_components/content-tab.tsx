import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Upload } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getCourseDetails } from '../../actions';
import { AddModuleForm, FormDialog } from './course-modal';
import { ModuleItemSkeleton, ModulesList } from './module-list';

export async function ContentTab({ courseId }: { courseId: string }) {
  const course = await getCourseDetails(courseId);
  if (!course) {
    notFound();
  }

  return (
    <div className="space-y-2">
      <ContentTabHeader />
      <Card>
        <CardHeader>
          <CardTitle>{course.title} - Course Structure</CardTitle>
          <CardDescription>
            Organize your course content into modules and lessons
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ModulesList initialModules={course.modules} courseId={course.id} />
        </CardContent>
      </Card>
    </div>
  );
}

function ContentTabHeader() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold">Course Content</h3>
          <p className="text-muted-foreground">
            Manage modules, lessons, and course materials
          </p>
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          <FormDialog
            trigger={
              <Button variant="outline">
                <Plus className="h-4 w-4" />
                Add Module
              </Button>
            }
            title="Add New Module"
            description="Create a new module for your course content."
            form={<AddModuleForm />}
            footer={<Button>Create Module</Button>}
          />
          <Button>
            <Upload className="h-4 w-4" /> Upload Content
          </Button>
        </div>
      </div>
    </div>
  );
}

function ContentTabHeaderSkeleton() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="mt-1 h-4 w-64" />
        </div>
        <div className="flex flex-shrink-0 items-center gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
    </div>
  );
}

export function ContentTabSkeleton() {
  return (
    <div className="space-y-6">
      <ContentTabHeaderSkeleton />
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-72" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-80" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ModuleItemSkeleton />
          <ModuleItemSkeleton />
        </CardContent>
      </Card>
    </div>
  );
}
