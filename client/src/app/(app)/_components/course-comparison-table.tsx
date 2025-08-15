'use client';

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
import { formatPrice } from '@/lib/utils';
import { Eye, Star } from 'lucide-react';
import Image from 'next/image';

interface CourseComparisonTableProps {
  data: {
    title: string;
    imageUrl?: string;
    students: number;
    completionRate: number;
    rating: number;
    revenue: number;
  }[];
}

export function CourseComparisonTable({ data }: CourseComparisonTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Course</TableHead>
          <TableHead>Students</TableHead>
          <TableHead>Completion Rate</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead>Revenue</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index}>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="bg-muted h-10 w-10 flex-shrink-0 rounded-md">
                  {row.imageUrl && (
                    <Image
                      src={row.imageUrl}
                      alt={row.title}
                      width={40}
                      height={40}
                      className="rounded-md object-cover"
                    />
                  )}
                </div>
                <span className="font-medium">{row.title}</span>
              </div>
            </TableCell>
            <TableCell>{row.students.toLocaleString()}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Progress value={row.completionRate} className="h-2 w-24" />
                <span>{row.completionRate}%</span>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {row.rating.toFixed(1)}
              </div>
            </TableCell>
            <TableCell>{formatPrice(row.revenue)}</TableCell>
            <TableCell className="text-end">
              <Eye className="text-muted-foreground hover:text-primary h-5 w-5 cursor-pointer" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function CourseComparisonTableSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Skeleton className="h-4 w-16" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-4 w-20" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-4 w-32" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-4 w-16" />
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
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-5 w-40" />
              </div>
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-12" />
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
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell>
              <div className="flex justify-end">
                <Skeleton className="h-5 w-5" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
