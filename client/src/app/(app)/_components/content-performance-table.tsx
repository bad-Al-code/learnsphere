'use client';

import { Badge } from '@/components/ui/badge';
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

interface ContentPerformanceTableProps {
  data: {
    contentType: string;
    engagementRate: number;
    completionRate: number;
    averageRating: number;
    performance: 'Excellent' | 'Good' | 'Needs Improvement';
  }[];
}

const getPerformanceBadgeVariant = (
  performance: 'Excellent' | 'Good' | 'Needs Improvement'
): 'default' | 'secondary' | 'destructive' => {
  switch (performance) {
    case 'Excellent':
      return 'default';
    case 'Good':
      return 'secondary';
    case 'Needs Improvement':
      return 'destructive';
    default:
      return 'secondary';
  }
};

export function ContentPerformanceTable({
  data,
}: ContentPerformanceTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Content Type</TableHead>
          <TableHead>Engagement Rate</TableHead>
          <TableHead>Completion Rate</TableHead>
          <TableHead>Average Rating</TableHead>
          <TableHead>Performance</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{row.contentType}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Progress value={row.engagementRate} className="h-2 w-24" />
                <span>{row.engagementRate}%</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Progress value={row.completionRate} className="h-2 w-24" />
                <span>{row.completionRate}%</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {row.averageRating.toFixed(1)}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={getPerformanceBadgeVariant(row.performance)}>
                {row.performance}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function ContentPerformanceTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Skeleton className="h-4 w-24" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-4 w-32" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-4 w-32" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-4 w-28" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-4 w-24" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-5 w-32" />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Skeleton className="h-2 w-24" />
                <Skeleton className="h-4 w-8" />
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Skeleton className="h-2 w-24" />
                <Skeleton className="h-4 w-8" />
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-6" />
              </div>
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-28 rounded-md" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
