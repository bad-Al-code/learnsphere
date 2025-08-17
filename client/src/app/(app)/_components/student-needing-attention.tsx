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
import { Eye, Mail } from 'lucide-react';

type Issue = 'Payment Overdue' | 'At Risk' | 'Low Engagement';
type Priority = 'High' | 'Medium' | 'Low';

interface AttentionStudentData {
  name: string;
  email: string;
  issue: Issue;
  warnings: number;
  priority: Priority;
  lastContact: string;
  image?: string;
}

interface StudentsNeedingAttentionProps {
  data?: AttentionStudentData[];
}

const placeholderData: AttentionStudentData[] = [
  {
    name: 'Emma Thompson',
    email: 'emma.thompson@email.com',
    issue: 'Payment Overdue',
    warnings: 1,
    priority: 'High',
    lastContact: '3 hours ago',
  },
  {
    name: 'David Kim',
    email: 'david.kim@email.com',
    issue: 'At Risk',
    warnings: 2,
    priority: 'High',
    lastContact: '2 days ago',
  },
  {
    name: 'Lisa Wang',
    email: 'lisa.wang@email.com',
    issue: 'Payment Overdue',
    warnings: 3,
    priority: 'High',
    lastContact: '1 week ago',
  },
];

export function StudentsNeedingAttention({
  data = placeholderData,
}: StudentsNeedingAttentionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Students Needing Attention</CardTitle>
        <CardDescription>
          Students with issues requiring immediate action
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Issue</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Last Contact</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((student) => (
              <TableRow key={student.email}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>
                        {getInitials(student.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-muted-foreground text-sm">
                        {student.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">{student.issue}</Badge>
                    <Badge variant="secondary">
                      {student.warnings} Warning{student.warnings > 1 && 's'}
                    </Badge>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant="destructive">{student.priority}</Badge>
                </TableCell>

                <TableCell className="text-muted-foreground">
                  {student.lastContact}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Mail className="mr-1.5 h-3.5 w-3.5" />
                      Contact
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-1.5 h-3.5 w-3.5" />
                      View
                    </Button>
                  </div>
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
        <CardTitle>
          <Skeleton className="h-6 w-52" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-72" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-16" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-20" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 3 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-28" />
                      <Skeleton className="h-3 w-40" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-28 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-12 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
