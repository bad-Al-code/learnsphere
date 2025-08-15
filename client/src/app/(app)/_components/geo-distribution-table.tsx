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

interface GeoDistributionTableProps {
  data: {
    region: string;
    students: number;
    revenue: number;
    avgRevenue: number;
    growth: number;
    marketShare: number;
  }[];
}

export function GeoDistributionTable({ data }: GeoDistributionTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Region</TableHead>
          <TableHead>Students</TableHead>
          <TableHead>Revenue</TableHead>
          <TableHead>Avg Revenue/Student</TableHead>
          <TableHead>Growth</TableHead>
          <TableHead>Market Share</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{row.region}</TableCell>
            <TableCell>{row.students.toLocaleString()}</TableCell>
            <TableCell>{formatPrice(row.revenue)}</TableCell>
            <TableCell>{formatPrice(row.avgRevenue)}</TableCell>
            <TableCell
              className={row.growth >= 0 ? 'text-emerald-500' : 'text-rose-500'}
            >
              {row.growth >= 0 ? '+' : ''}
              {row.growth}%
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Progress value={row.marketShare} className="h-2 w-24" />
                <span>{row.marketShare}%</span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function GeoDistributionTableSkeleton() {
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
            <Skeleton className="h-4 w-20" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-4 w-40" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-4 w-16" />
          </TableHead>
          <TableHead>
            <Skeleton className="h-4 w-28" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 6 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell>
              <Skeleton className="h-5 w-32" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-12" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-20" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-10" />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Skeleton className="h-2 w-24" />
                <Skeleton className="h-4 w-8" />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
