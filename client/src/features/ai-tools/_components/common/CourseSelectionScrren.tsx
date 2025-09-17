import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, Bot, GraduationCap, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useGetEnrolledCourses } from '../../hooks/useAiConversations';

export function CourseSelectionScreen() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: courses, isLoading, isError } = useGetEnrolledCourses();

  const handleCourseSelect = (courseId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentTab = searchParams.get('tab') || 'ai-tutor';

    params.set('tab', currentTab);
    params.set('courseId', courseId);

    router.replace(`${pathname}?${params.toString()}`);
  };

  if (isLoading) {
    return <CourseSelectionSkeleton />;
  }

  if (isError || !courses) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="space-y-4 text-center">
          <div className="bg-destructive/10 mx-auto flex h-20 w-20 items-center justify-center rounded-full">
            <BookOpen className="text-destructive h-10 w-10" />
          </div>

          <div className="space-y-2">
            <h3 className="text-foreground text-xl font-semibold">
              Unable to Load Courses
            </h3>
            <p className="text-muted-foreground max-w-md">
              We encountered an error while loading your enrolled courses.
              Please try refreshing the page.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="space-y-6 text-center">
          <div className="relative mx-auto">
            <div className="from-primary/20 to-primary/5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br shadow-lg">
              <GraduationCap className="text-primary h-10 w-10" />
            </div>

            <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 shadow-sm">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-foreground text-2xl font-bold">
              No Courses Found
            </h3>
            <p className="text-muted-foreground max-w-md">
              You need to be enrolled in at least one course to start chatting
              with your AI Study Assistant.
            </p>
          </div>

          <div className="mx-auto grid max-w-sm grid-cols-1 gap-3 text-left">
            {[
              { icon: BookOpen, text: 'Browse available courses' },
              {
                icon: GraduationCap,
                text: 'Enroll in courses that interest you',
              },
              { icon: Bot, text: 'Return here to start learning' },
            ].map((item, index) => (
              <div
                key={index}
                className="border-border/50 bg-background/50 flex items-center gap-3 rounded-lg border p-3 backdrop-blur-sm"
              >
                <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
                  <item.icon className="text-primary h-4 w-4" />
                </div>

                <span className="text-muted-foreground text-sm">
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full space-y-6 p-8">
      <div className="space-y-4 text-center">
        <div className="from-primary/20 to-primary/5 relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br shadow-lg">
          <Bot className="text-primary h-10 w-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-foreground text-3xl font-bold">
            Choose Your Course
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Select one of your enrolled courses to start an intelligent
            conversation with your AI Study Assistant.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {courses.map((enrollment) => (
          <Card
            key={enrollment.enrollmentId}
            className="group hover:border-primary/30 border-border/50 cursor-pointer overflow-hidden pt-0 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
            onClick={() => handleCourseSelect(enrollment.course.id)}
          >
            <div className="relative overflow-hidden">
              <AspectRatio ratio={16 / 9}>
                <Image
                  src={enrollment.course.imageUrl || '/images/placeholder.svg'}
                  alt={enrollment.course.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </AspectRatio>

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />

              <div className="absolute right-3 bottom-3 left-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                    <BookOpen className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-xs font-medium text-white/90">
                    {Math.round(enrollment.progressPercentage)}% Complete
                  </span>
                </div>
              </div>
            </div>

            <CardHeader className="space-y-3">
              <div className="space-y-2">
                <CardTitle className="text-foreground group-hover:text-primary line-clamp-2 text-base leading-tight font-semibold transition-colors">
                  {enrollment.course.title}
                </CardTitle>
                <p className="text-muted-foreground text-xs">
                  Enrolled{' '}
                  {new Date(enrollment.enrolledAt).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Bot className="text-primary h-4 w-4" />
                  <span className="text-primary text-xs font-medium">
                    AI Ready
                  </span>
                </div>

                <div className="bg-primary/10 flex items-center gap-1 rounded-full px-2 py-1">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-xs font-medium text-green-700 dark:text-green-400">
                    Active
                  </span>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function CourseSelectionSkeleton() {
  return (
    <div className="h-full space-y-6 p-8">
      <div className="space-y-4 text-center">
        <Skeleton className="mx-auto h-20 w-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="mx-auto h-8 w-64" />
          <Skeleton className="mx-auto h-4 w-80" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="relative">
              <Skeleton className="aspect-video w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <CardHeader className="space-y-3">
              <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
