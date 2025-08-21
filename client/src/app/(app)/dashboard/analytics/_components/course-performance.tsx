import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Star } from 'lucide-react';

type CoursePerformanceData = {
  course: string;
  students: number;
  completion: number;
  avgGrade: number;
  satisfaction: number;
  engagement: number;
  dropoutRate: number;
};

const courseData: CoursePerformanceData[] = [
  {
    course: 'Data Science',
    students: 320,
    completion: 85,
    avgGrade: 4.8,
    satisfaction: 4.8,
    engagement: 88,
    dropoutRate: 12,
  },
  {
    course: 'Web Development',
    students: 280,
    completion: 92,
    avgGrade: 3.6,
    satisfaction: 4.6,
    engagement: 90,
    dropoutRate: 8,
  },
  {
    course: 'Digital Marketing',
    students: 250,
    completion: 78,
    avgGrade: 3.4,
    satisfaction: 4.4,
    engagement: 82,
    dropoutRate: 18,
  },
  {
    course: 'Graphic Design',
    students: 220,
    completion: 88,
    avgGrade: 3.7,
    satisfaction: 4.7,
    engagement: 85,
    dropoutRate: 10,
  },
];

export function CoursePerformance() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Performance Comparison</CardTitle>
        <CardDescription>Detailed metrics for each course</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Course</TableHead>
              <TableHead>Students</TableHead>
              <TableHead>Completion</TableHead>
              <TableHead>Avg Grade</TableHead>
              <TableHead>Satisfaction</TableHead>
              <TableHead>Engagement</TableHead>
              <TableHead>Dropout Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {courseData.map((data) => (
              <TableRow key={data.course}>
                <TableCell className="font-medium">{data.course}</TableCell>
                <TableCell>{data.students}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={data.completion} className="h-2 w-16" />
                    <span>{data.completion}%</span>
                  </div>
                </TableCell>
                <TableCell>{data.avgGrade}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span>{data.satisfaction}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="default">{data.engagement}%</Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      data.dropoutRate > 10 ? 'destructive' : 'secondary'
                    }
                  >
                    {data.dropoutRate}%
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function CoursePerformanceSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-72" />
        <Skeleton className="h-5 w-52" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between px-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
          </div>
          <hr />

          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-4 py-2"
            >
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-12" />
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-5 w-8" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-8 w-14 rounded-full" />
              <Skeleton className="h-8 w-14 rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
