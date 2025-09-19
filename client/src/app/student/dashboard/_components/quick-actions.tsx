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
  BookOpen,
  Bot,
  Calendar,
  LucideIcon,
  MessageSquare,
  PlayCircle,
  Users,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

interface Action {
  label: string;
  icon: LucideIcon;
  href: string;
}

const actions: Action[] = [
  { label: 'Start Study Session', icon: PlayCircle, href: '/student/courses' },
  { label: 'Join Study Group', icon: Users, href: '/student/community' },
  { label: 'Ask AI Tutor', icon: Bot, href: '/student/ai-tools' },
  { label: 'View Calendar', icon: Calendar, href: '/student/assignments' },
  { label: 'Browse Courses', icon: BookOpen, href: '/courses' },
  { label: 'Check Messages', icon: MessageSquare, href: '/student/messages' },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5" />
          <CardTitle>Quick Actions</CardTitle>
        </div>
        <CardDescription>Jump to your most used features</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {actions.map((action) => (
            <Button key={action.label} variant="outline" className="" asChild>
              <Link href={action.href}>
                <action.icon className="h-5 w-5 flex-shrink-0" />
                <span className="truncate text-sm">{action.label}</span>
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
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-4 w-56" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
