'use client';

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
  Award,
  Calendar,
  FileText,
  MessageSquarePlus,
  PlusCircle,
  Users,
} from 'lucide-react';
import Link from 'next/link';

const actions = [
  {
    label: 'Create New Course',
    href: '/dashboard/courses/create',
    icon: PlusCircle,
  },
  {
    label: 'Send Announcement',
    href: '/dashboard/communication?tab=announcements',
    icon: MessageSquarePlus,
  },
  {
    label: 'View All Students',
    href: '/dashboard/students',
    icon: Users,
  },
  {
    label: 'Generate Report',
    href: '/dashboard/analytics?tab=reports',
    icon: FileText,
  },
  {
    label: 'Schedule Session',
    href: '/dashboard/schedule',
    icon: Calendar,
  },
  {
    label: 'Issue Certificates',
    href: '/dashboard/certificates',
    icon: Award,
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          {actions.map((action) => (
            <Button
              key={action.href}
              asChild
              variant="outline"
              className="justify-start"
            >
              <Link href={action.href}>
                <action.icon className="mr-1 h-4 w-4" />
                {action.label}
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function QuickActionsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-4 w-44" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
