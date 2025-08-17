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
import { getInitials } from '@/lib/utils';
import { Eye, MessageSquare, MoreHorizontal } from 'lucide-react';

type Status = 'Active' | 'At Risk' | 'Inactive';
type Payment = 'Paid' | 'Overdue';

interface StudentData {
  name: string;
  email: string;
  courses: string[];
  progress: number;
  grade: string;
  status: Status;
  payment: Payment;
  lastActive: string;
}

interface AllStudentsTableProps {
  data?: StudentData[];
}

const placeholderData: StudentData[] = [
  {
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    courses: ['Data Science', 'Machine Learning'],
    progress: 92,
    grade: 'A',
    status: 'Active',
    payment: 'Paid',
    lastActive: '2 hours ago',
  },
  {
    name: 'Michael Rodriguez',
    email: 'michael.r@email.com',
    courses: ['Web Development', 'JavaScript'],
    progress: 88,
    grade: 'A-',
    status: 'Active',
    payment: 'Paid',
    lastActive: '1 hour ago',
  },
  {
    name: 'Emma Thompson',
    email: 'emma.thompson@email.com',
    courses: ['Digital Marketing', 'SEO Fundamentals'],
    progress: 76,
    grade: 'B+',
    status: 'Active',
    payment: 'Overdue',
    lastActive: '3 hours ago',
  },
  {
    name: 'David Kim',
    email: 'david.kim@email.com',
    courses: ['Graphic Design'],
    progress: 45,
    grade: 'B',
    status: 'At Risk',
    payment: 'Paid',
    lastActive: '2 days ago',
  },
  {
    name: 'Lisa Wang',
    email: 'lisa.wang@email.com',
    courses: ['Data Science'],
    progress: 0,
    grade: 'N/A',
    status: 'Inactive',
    payment: 'Overdue',
    lastActive: '1 week ago',
  },
];

const getStatusVariant = (
  status: Status
): 'default' | 'destructive' | 'secondary' => {
  switch (status) {
    case 'Active':
      return 'default';
    case 'At Risk':
      return 'destructive';
    case 'Inactive':
      return 'secondary';
  }
};

const getPaymentVariant = (payment: Payment): 'default' | 'destructive' => {
  return payment === 'Paid' ? 'default' : 'destructive';
};

export function AllStudentsTable({
  data = placeholderData,
}: AllStudentsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Students ({data.length})</CardTitle>
        <CardDescription>
          Comprehensive view of all enrolled students
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">Student</TableHead>
              <TableHead>Courses</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead className="">Grade</TableHead>
              <TableHead className="">Status</TableHead>
              <TableHead className="">Payment</TableHead>
              <TableHead className="">Last Active</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((student) => (
              <TableRow key={student.email}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar>
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
                  <div className="flex flex-wrap gap-1">
                    {student.courses.map((c) => (
                      <Badge key={c} variant="secondary">
                        {c}
                      </Badge>
                    ))}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={student.progress} className="h-2 w-16" />
                    <span className="text-muted-foreground text-sm">
                      {student.progress}%
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant="secondary">{student.grade}</Badge>
                </TableCell>

                <TableCell>
                  <Badge variant={getStatusVariant(student.status)}>
                    {student.status}
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge variant={getStatusVariant(student.status)}>
                    {student.payment}
                  </Badge>
                </TableCell>

                <TableCell className="text-muted-foreground">
                  {student.lastActive}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
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

export function AllStudentsTableSkeleton({
  data = placeholderData,
}: AllStudentsTableProps) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <CardDescription>
          <Skeleton className="h-4 w-72" />
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-4 w-30" />
              </TableHead>
              <TableHead className="">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="">
                <Skeleton className="h-4 w-20" />
              </TableHead>
              <TableHead className="text-center">
                <Skeleton className="h-4 w-20" />
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="flex flex-col space-y-1">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-3 w-36" />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-2 w-20" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-10" />
                </TableCell>
                <TableCell className="">
                  <Skeleton className="h-4 w-10" />
                </TableCell>
                <TableCell className="">
                  <Skeleton className="h-4 w-10" />
                </TableCell>{' '}
                <TableCell className="">
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex space-x-1">
                    <Skeleton className="h-4 w-6" />
                    <Skeleton className="h-4 w-6" />
                    <Skeleton className="h-4 w-6" />
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
