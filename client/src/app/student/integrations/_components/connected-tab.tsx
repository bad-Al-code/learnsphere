'use client';

import {
  BookOpen,
  Calendar,
  CheckCircle,
  Cloud,
  Mail,
  Slack,
  TriangleAlert,
} from 'lucide-react';
import React from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';

type TConnectionStatus = 'ok' | 'warning';
type TConnectedApp = {
  id: string;
  name: string;
  icon: React.ElementType;
  lastSync: string;
  status: TConnectionStatus;
  isEnabled: boolean;
};

const connectedAppsData: TConnectedApp[] = [
  {
    id: '1',
    name: 'Google Calendar',
    icon: Calendar,
    lastSync: '1m ago',
    status: 'ok',
    isEnabled: true,
  },
  {
    id: '2',
    name: 'Gmail',
    icon: Mail,
    lastSync: '4m ago',
    status: 'ok',
    isEnabled: true,
  },
  {
    id: '3',
    name: 'Google Drive',
    icon: Cloud,
    lastSync: '1m ago',
    status: 'ok',
    isEnabled: true,
  },
  {
    id: '4',
    name: 'Canvas LMS',
    icon: BookOpen,
    lastSync: '17m ago',
    status: 'warning',
    isEnabled: true,
  },
  {
    id: '5',
    name: 'Slack',
    icon: Slack,
    lastSync: '32m ago',
    status: 'ok',
    isEnabled: false,
  },
];

function ConnectedAppCard({ app }: { app: TConnectedApp }) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <app.icon className="text-muted-foreground h-5 w-5" />
          <div>
            <h3 className="font-semibold">{app.name}</h3>
            <p className="text-muted-foreground text-xs">{app.lastSync}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {app.status === 'ok' ? (
            <CheckCircle className="h-5 w-5 text-emerald-500" />
          ) : (
            <TriangleAlert className="h-5 w-5 text-blue-500" />
          )}
          <Switch defaultChecked={app.isEnabled} />
        </div>
      </CardContent>
    </Card>
  );
}

function ConnectedAppCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-6" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5 rounded-full" />
          <Skeleton className="h-6 w-11 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ConnectedTab() {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {connectedAppsData.map((app) => (
        <ConnectedAppCard key={app.id} app={app} />
      ))}
    </div>
  );
}

export function ConnectedTabSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <ConnectedAppCardSkeleton key={i} />
      ))}
    </div>
  );
}
