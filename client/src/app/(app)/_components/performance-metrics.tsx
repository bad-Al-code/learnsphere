'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Metric {
  label: string;
  value: string;
}

interface PerformanceMetricsProps {
  data?: Metric[];
}

const placeholderData: Metric[] = [
  { label: 'Average Completion Rate', value: '78%' },
  { label: 'Average Grade', value: 'B+' },
  { label: 'Student Retention', value: '92%' },
  { label: 'Avg Time per Session', value: '45m' },
];

export function PerformanceMetrics({
  data = placeholderData,
}: PerformanceMetricsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>Key performance indicators</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {data.map((metric) => (
            <div
              className="flex items-center justify-between"
              key={metric.label}
            >
              <p className="text-muted-foreground">{metric.label}</p>
              <p className="font-semibold">{metric.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function PerformanceMetricsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-48" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-56" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex items-center justify-between">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-12" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
