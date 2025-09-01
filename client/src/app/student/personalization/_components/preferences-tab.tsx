'use client';

import { Bell, Settings } from 'lucide-react';
import React from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';

type TPreference = {
  id: string;
  title: string;
  description: string;
  defaultEnabled: boolean;
};

const dashboardPreferences: TPreference[] = [
  {
    id: 'dp1',
    title: 'Show Weather Widget',
    description: 'Display current weather information',
    defaultEnabled: true,
  },
  {
    id: 'dp2',
    title: 'Show Daily Quotes',
    description: 'Display motivational quotes',
    defaultEnabled: true,
  },
  {
    id: 'dp3',
    title: 'Show Study Timer',
    description: 'Display study session timer',
    defaultEnabled: true,
  },
  {
    id: 'dp4',
    title: 'Show Activity Feed',
    description: 'Display recent learning activity',
    defaultEnabled: true,
  },
  {
    id: 'dp5',
    title: 'Compact Mode',
    description: 'Use smaller spacing and components',
    defaultEnabled: false,
  },
  {
    id: 'dp6',
    title: 'Auto-save Settings',
    description: 'Automatically save preference changes',
    defaultEnabled: true,
  },
];

const notificationPreferences: TPreference[] = [
  {
    id: 'np1',
    title: 'Desktop Notifications',
    description: 'Show browser notifications',
    defaultEnabled: true,
  },
  {
    id: 'np2',
    title: 'Email Notifications',
    description: 'Receive notifications via email',
    defaultEnabled: true,
  },
  {
    id: 'np3',
    title: 'Sound Notifications',
    description: 'Play sounds for notifications',
    defaultEnabled: false,
  },
];

function PreferenceItem({ preference }: { preference: TPreference }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h4 className="font-medium">{preference.title}</h4>
        <p className="text-muted-foreground text-sm">
          {preference.description}
        </p>
      </div>
      <Switch defaultChecked={preference.defaultEnabled} />
    </div>
  );
}

function DashboardPreferences() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <CardTitle>Dashboard Preferences</CardTitle>
        </div>
        <CardDescription>
          Customize your dashboard behavior and features
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {dashboardPreferences.map((pref, index) => (
            <React.Fragment key={pref.id}>
              <PreferenceItem preference={pref} />
              {index < dashboardPreferences.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function NotificationPreferences() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <CardTitle>Notification Preferences</CardTitle>
        </div>
        <CardDescription>Control how you receive notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notificationPreferences.map((pref, index) => (
            <React.Fragment key={pref.id}>
              <PreferenceItem preference={pref} />
              {index < notificationPreferences.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PreferencesCardSkeleton({ itemCount }: { itemCount: number }) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: itemCount }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-6 w-11 rounded-full" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function PreferencesTabSkeleton() {
  return (
    <div className="space-y-2">
      <PreferencesCardSkeleton itemCount={6} />
      <PreferencesCardSkeleton itemCount={3} />
    </div>
  );
}

export function PreferencesTab() {
  return (
    <div className="space-y-2">
      <DashboardPreferences />
      <NotificationPreferences />
    </div>
  );
}
