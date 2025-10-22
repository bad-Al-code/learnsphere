import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import {
  Award,
  BookOpen,
  ChevronLeft,
  Clock,
  MoreVertical,
  Star,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CourseDetail } from '../schema/course-detail.schema';

interface CourseHeaderProps {
  course: CourseDetail;
}

export function CourseHeader({ course }: CourseHeaderProps) {
  const router = useRouter();

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    return `${hours}h total`;
  };

  return (
    <div className="bg-card border-b">
      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/student/courses')}
              className="flex-shrink-0"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="min-w-0 flex-1">
              <h1 className="mb-1 truncate text-xl font-bold sm:text-2xl">
                {course.title}
              </h1>

              <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs sm:gap-4 sm:text-sm">
                <div className="flex items-center gap-1">
                  <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
                    <AvatarImage src={course.instructor.avatar} />
                    <AvatarFallback className="text-xs">
                      {getInitials(
                        course.instructor.firstName,
                        course.instructor.lastName
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">
                    {course.instructor.firstName} {course.instructor.lastName}
                  </span>
                  <span className="sm:hidden">Instructor</span>
                </div>

                {course.rating && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 sm:h-4 sm:w-4" />
                      <span>{course.rating}</span>
                    </div>
                  </>
                )}

                {course.totalStudents && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{course.totalStudents.toLocaleString()}</span>
                    </div>
                  </>
                )}

                {course.estimatedDuration && (
                  <>
                    <span className="hidden lg:inline">•</span>
                    <div className="hidden items-center gap-1 lg:flex">
                      <Clock className="h-4 w-4" />
                      <span>{formatDuration(course.estimatedDuration)}</span>
                    </div>
                  </>
                )}

                {course.level && (
                  <>
                    <span className="hidden lg:inline">•</span>
                    <Badge
                      variant="secondary"
                      className="hidden capitalize lg:inline-flex"
                    >
                      {course.level}
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="flex-shrink-0">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <BookOpen className="mr-2 h-4 w-4" />
                Course Overview
              </DropdownMenuItem>
              {course.certificates && course.certificates.length > 0 && (
                <DropdownMenuItem>
                  <Award className="mr-2 h-4 w-4" />
                  View Certificate
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem>Report an Issue</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">Progress</span>
              <span className="text-muted-foreground">
                {course.completedLessons} of {course.totalLessons} lessons
                completed
              </span>
            </div>
            <span className="font-semibold">{course.progressPercentage}%</span>
          </div>
          <Progress value={course.progressPercentage} className="h-2" />
        </div>

        {course.progressPercentage === 100 && course.certificates && (
          <div className="flex items-center gap-3 rounded-lg border border-green-500/20 bg-green-500/10 p-3">
            <Award className="h-5 w-5 flex-shrink-0 text-green-600" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-green-600">
                Congratulations! You've completed this course
              </p>
              <p className="text-xs text-green-600/80">
                Your certificate is ready to download
              </p>
            </div>
            <Button size="sm" variant="outline" className="flex-shrink-0">
              View Certificate
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
