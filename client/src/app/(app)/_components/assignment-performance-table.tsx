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

interface AssignmentPerformanceTableProps {
  data: {
    assignment: string;
    submitted: number;
    graded: number;
    avgScore: number;
    scoreLabel: string;
    onTimePercentage: number;
    difficulty: 'Hard' | 'Medium' | 'Easy';
    status: 'Pending' | 'Complete';
  }[];
}

const getDifficultyVariant = (
  difficulty: 'Hard' | 'Medium' | 'Easy'
): 'destructive' | 'secondary' | 'default' => {
  if (difficulty === 'Hard') return 'destructive';
  if (difficulty === 'Medium') return 'secondary';
  return 'default';
};

export function AssignmentPerformanceTable({
  data,
}: AssignmentPerformanceTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Assignment</TableHead>
          <TableHead>Submitted</TableHead>
          <TableHead>Graded</TableHead>
          <TableHead>Avg Score</TableHead>
          <TableHead>On-Time %</TableHead>
          <TableHead>Difficulty</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{row.assignment}</TableCell>
            <TableCell>{row.submitted}</TableCell>
            <TableCell>{row.graded}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <span>{row.avgScore}%</span>
                <Badge variant="outline">{row.scoreLabel}</Badge>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Progress value={row.onTimePercentage} className="h-2 w-24" />
                <span>{row.onTimePercentage}%</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant={getDifficultyVariant(row.difficulty)}>
                {row.difficulty}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant={row.status === 'Complete' ? 'default' : 'secondary'}
              >
                {row.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function AssignmentPerformanceTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Skeleton className="h-4 w-24" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-4 w-20" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-4 w-16" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-4 w-24" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-4 w-24" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-4 w-20" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-4 w-16" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 6 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-5 w-40" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-10" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-10" />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-6 w-20 rounded-md" />
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Skeleton className="h-2 w-24" />
                <Skeleton className="h-4 w-8" />
              </div>
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-16 rounded-md" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-6 w-20 rounded-md" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
