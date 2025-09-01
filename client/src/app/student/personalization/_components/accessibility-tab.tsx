'use client';

import { Accessibility } from 'lucide-react';
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
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

type TTogglePreference = {
  id: string;
  title: string;
  description: string;
  defaultEnabled: boolean;
};

const togglePreferences: TTogglePreference[] = [
  {
    id: 'tp1',
    title: 'High Contrast Mode',
    description: 'Increase contrast for better visibility',
    defaultEnabled: true,
  },
  {
    id: 'tp2',
    title: 'Reduce Motion',
    description: 'Minimize animations and transitions',
    defaultEnabled: false,
  },
  {
    id: 'tp3',
    title: 'Enable Animations',
    description: 'Show smooth transitions and effects',
    defaultEnabled: true,
  },
];

export function AccessibilityTab() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Accessibility className="h-5 w-5" />
          <CardTitle>Accessibility Settings</CardTitle>
        </div>
        <CardDescription>
          Customize the interface for better accessibility
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Font Size</label>
          <Slider defaultValue={[16]} min={12} max={24} step={1} />
          <div className="text-muted-foreground flex justify-between text-xs">
            <span>Small (12px)</span>
            <span>Current: 16px</span>
            <span>Large (24px)</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Line Height</label>
          <Slider defaultValue={[1.5]} min={1.2} max={2.0} step={0.1} />
          <div className="text-muted-foreground flex justify-between text-xs">
            <span>Tight (1.2)</span>
            <span>Current: 1.5</span>
            <span>Loose (2.0)</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          {togglePreferences.map((pref, index) => (
            <React.Fragment key={pref.id}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{pref.title}</h4>
                  <p className="text-muted-foreground text-sm">
                    {pref.description}
                  </p>
                </div>
                <Switch defaultChecked={pref.defaultEnabled} />
              </div>
              {index < togglePreferences.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function AccessibilityTabSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-2 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-2 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-64" />
              </div>
              <Skeleton className="h-6 w-11 rounded-full" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
