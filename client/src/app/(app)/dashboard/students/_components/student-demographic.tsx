import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemo } from 'react';

interface DemographicsData {
  ageGroup: string;
  count: number;
}

interface StudentDemographicsProps {
  data?: DemographicsData[];
}

const placeholderData: DemographicsData[] = [
  { ageGroup: 'Age 18-25', count: 450 },
  { ageGroup: 'Age 26-35', count: 375 },
  { ageGroup: 'Age 36-45', count: 250 },
  { ageGroup: 'Age 46+', count: 175 },
];

export function StudentDemographics({
  data = placeholderData,
}: StudentDemographicsProps) {
  const maxValue = useMemo(() => {
    return Math.max(...data.map((item) => item.count), 0);
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Demographics</CardTitle>
        <CardDescription>Age distribution of enrolled students</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item) => (
            <div key={item.ageGroup} className="flex items-center gap-4">
              <p className="text-muted-foreground w-24 shrink-0 text-sm">
                {item.ageGroup}
              </p>
              <div className="flex flex-grow items-center gap-4">
                <Progress
                  value={(item.count / maxValue) * 100}
                  className="h-2"
                />
                <p className="w-10 text-right font-semibold">
                  {item.count.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function StudentDemographicsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-48" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-64" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4">
              <Skeleton className="h-5 w-24" />
              <div className="flex flex-grow items-center gap-4">
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-5 w-10" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
