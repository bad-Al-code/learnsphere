'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarPlus, Send, Video } from 'lucide-react';

import type { LucideIcon } from 'lucide-react';
type QuickAction = { label: string; icon: LucideIcon; action: () => void };
const actions: QuickAction[] = [
  {
    label: 'Schedule Office Hours',
    icon: CalendarPlus,
    action: () => alert('Scheduling Office Hours...'),
  },
  {
    label: 'Create Online Meeting',
    icon: Video,
    action: () => alert('Creating Meeting...'),
  },
  {
    label: 'Send Reminder',
    icon: Send,
    action: () => alert('Sending Reminder...'),
  },
];

export async function QuickActions() {
  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  await sleep(2000);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={action.action}
          >
            <action.icon className="h-4 w-4" />
            <span>{action.label}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

export function QuickActionsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent className="grid gap-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}
