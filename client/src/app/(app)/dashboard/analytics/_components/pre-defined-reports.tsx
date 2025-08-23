import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Download } from 'lucide-react';

type ReportCardProps = {
  title: string;
  description: string;
  features: string[];
};

const reportData: ReportCardProps[] = [
  {
    title: 'Monthly Report',
    description: 'Comprehensive monthly performance summary',
    features: [
      'Student progress and completion rates',
      'Course performance metrics',
      'Engagement and satisfaction scores',
      'Recommendations for improvement',
    ],
  },
  {
    title: 'Student Progress Report',
    description: 'Individual student performance analysis',
    features: [
      'Individual student progress tracking',
      'Assignment and quiz performance',
      'Engagement and participation data',
      'Personalized recommendations',
    ],
  },
  {
    title: 'Course Effectiveness Report',
    description: 'Detailed course performance analysis',
    features: [
      'Course completion and dropout rates',
      'Content effectiveness metrics',
      'Student feedback analysis',
      'Improvement suggestions',
    ],
  },
];

export function PredefinedReports() {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
      {reportData.map((report) => (
        <Card key={report.title} className="flex flex-col">
          <CardHeader>
            <CardTitle>{report.title}</CardTitle>
            <CardDescription>{report.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="text-muted-foreground space-y-2 text-sm">
              {report.features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <span className="bg-muted-foreground mt-1 mr-2 inline-block h-1 w-1 rounded-full" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export function PredefinedReportsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="flex flex-col">
          <CardHeader>
            <Skeleton className="h-7 w-48" />
            <Skeleton className="mt-1 h-5 w-full" />
          </CardHeader>
          <CardContent className="flex-grow space-y-2">
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
