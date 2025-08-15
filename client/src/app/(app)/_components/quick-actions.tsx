'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
    href: '/dashboard/instructor/courses/create',
    icon: PlusCircle,
  },
  {
    label: 'Send Announcement',
    href: '/dashboard/instructor/communication?tab=announcements',
    icon: MessageSquarePlus,
  },
  {
    label: 'View All Students',
    href: '/dashboard/instructor/students',
    icon: Users,
  },
  {
    label: 'Generate Report',
    href: '/dashboard/instructor/analytics?tab=reports',
    icon: FileText,
  },
  {
    label: 'Schedule Session',
    href: '/dashboard/instructor/schedule',
    icon: Calendar,
  },
  {
    label: 'Issue Certificates',
    href: '/dashboard/instructor/certificates',
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
