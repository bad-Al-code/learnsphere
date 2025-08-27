import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { getInitials } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { AlertTriangle, MessageSquare } from 'lucide-react';

interface StudentsNeedingAttentionProps {
  data: {
    student: {
      name: string;
      avatarUrl?: string;
    };
    lastActive: Date;
    reason: string;
    details: string;
  }[];
}

export function StudentsNeedingAttention({
  data,
}: StudentsNeedingAttentionProps) {
  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-destructive h-5 w-5" />
          <CardTitle className="text-destructive">
            Students Needing Attention
          </CardTitle>
        </div>
        <CardDescription>
          Students who may need additional support based on recent activity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Reason for Flag</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((student, index) => (
              <TableRow key={index} className="hover:bg-destructive/10">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={student.student.avatarUrl} />
                      <AvatarFallback>
                        {getInitials(student.student.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{student.student.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="destructive">{student.reason}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {student.details}
                </TableCell>
                <TableCell className="text-muted-foreground text-xs">
                  {formatDistanceToNow(student.lastActive, { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="h-4 w-4" />
                    Message
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function StudentsNeedingAttentionSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-56" />
        </div>
        <Skeleton className="h-4 w-80" />
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-4 w-20" />
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
              <TableHead className="text-right">
                <Skeleton className="ml-auto h-4 w-16" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-5 w-28" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24 rounded-md" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-48" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="ml-auto h-8 w-24" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
