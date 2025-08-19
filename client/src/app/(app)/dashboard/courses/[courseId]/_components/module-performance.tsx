import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ModulePerformanceProps {
  data: {
    module: string;
    completionRate: number;
    avgScore: number;
    timeSpent: string;
    satisfaction: number;
  }[];
}

export function ModulePerformance({ data }: ModulePerformanceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Module Performance Analysis</CardTitle>
        <CardDescription>
          Detailed breakdown of student progress by module.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Module</TableHead>
              <TableHead>Completion Rate</TableHead>
              <TableHead>Avg Score</TableHead>
              <TableHead>Time Spent</TableHead>
              <TableHead>Satisfaction</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.module}>
                <TableCell className="font-medium">{row.module}</TableCell>
                <TableCell>{row.completionRate}%</TableCell>
                <TableCell>{row.avgScore}%</TableCell>
                <TableCell>{row.timeSpent}</TableCell>
                <TableCell>{row.satisfaction}/5.0</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function ModulePerformanceSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-64" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-80" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-32" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-28" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 4 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-5 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
