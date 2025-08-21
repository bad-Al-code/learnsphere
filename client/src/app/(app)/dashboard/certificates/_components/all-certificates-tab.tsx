'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { getInitials } from '@/lib/utils';
import {
  Eye,
  Link as LinkIcon,
  MoreHorizontal,
  Search,
  Send,
} from 'lucide-react';

type CertificateStatus = 'Issued' | 'Pending' | 'Revoked';
interface CertificateData {
  student: { name: string; email: string; avatarUrl?: string };
  course: { title: string; code: string };
  grade: string;
  progress: number;
  status: CertificateStatus;
  certificateId: string;
  verificationId: string;
  downloads: number;
  completedDate: string;
}

const placeholderData: CertificateData[] = [
  {
    student: {
      name: 'Sarah Chen',
      email: 'sarah.chen@email.com',
      avatarUrl: 'https://picsum.photos/seed/sarah/40/40',
    },
    course: { title: 'Data Science Fundamentals', code: 'DS101' },
    grade: 'A',
    progress: 95,
    status: 'Pending',
    certificateId: 'ID: DS101-2024-001',
    verificationId: 'VER-DS101-2024-001',
    downloads: 3,
    completedDate: '12/10/2024',
  },
  {
    student: {
      name: 'Michael Rodriguez',
      email: 'michael.r@email.com',
      avatarUrl: 'https://picsum.photos/seed/michael/40/40',
    },
    course: { title: 'Web Development Bootcamp', code: 'WD201' },
    grade: 'A-',
    progress: 88,
    status: 'Issued',
    certificateId: 'ID: WD201-2024-002',
    verificationId: 'VER-WD201-2024-002',
    downloads: 1,
    completedDate: '12/8/2024',
  },
  {
    student: { name: 'Emma Thompson', email: 'emma.thompson@email.com' },
    course: { title: 'Digital Marketing Mastery', code: 'DM301' },
    grade: 'B+',
    progress: 82,
    status: 'Pending',
    certificateId: 'ID: DM301-2024-002',
    verificationId: 'VER-DM301-2024-002',
    downloads: 0,
    completedDate: 'Not issued',
  },
];

const getStatusVariant = (status: CertificateStatus) => {
  switch (status) {
    case 'Issued':
      return 'default';
    case 'Pending':
      return 'secondary';
    case 'Revoked':
      return 'destructive';
  }
};

function CertificateCard({ data }: { data: CertificateData }) {
  return (
    <Card>
      <CardContent className="">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={data.student.avatarUrl} />
              <AvatarFallback>{getInitials(data.student.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold">{data.student.name}</p>
              <p className="text-muted-foreground text-sm">
                {data.student.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-center">
            <div>
              <p className="font-semibold">{data.course.title}</p>
              <p className="text-muted-foreground text-sm">
                Code: {data.course.code}
              </p>
            </div>
            <div>
              <p className="font-semibold">{data.grade}</p>
              <p className="text-muted-foreground text-sm">{data.progress}%</p>
            </div>
            <Badge variant={getStatusVariant(data.status)}>{data.status}</Badge>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Send />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Eye />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <LinkIcon />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Revoke</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="text-muted-foreground flex flex-wrap justify-between gap-2 text-xs">
          <p>{data.certificateId}</p>
          <p>Verification: {data.verificationId}</p>
          <p>Downloads: {data.downloads}</p>
          <p>Completed: {data.completedDate}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function AllCertificatesTab() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg">
        <div className="relative min-w-[250px] flex-1">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
          <Input placeholder="Search certificates..." className="pl-8" />
        </div>
        <div className="flex gap-2">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="issued">Issued</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ds">Data Science</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        {placeholderData.map((cert) => (
          <CertificateCard key={cert.certificateId} data={cert} />
        ))}
      </div>
    </div>
  );
}

function CertificateCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-6 w-24 rounded-full" />
            <div className="flex gap-1">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
        <Separator className="my-4" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

export function AllCertificatesTabSkeleton() {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2 rounded-lg p-2">
        <Skeleton className="h-10 min-w-[250px] flex-1" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
      </div>
      <div className="space-y-2">
        <CertificateCardSkeleton />
        <CertificateCardSkeleton />
        <CertificateCardSkeleton />
      </div>
    </div>
  );
}
