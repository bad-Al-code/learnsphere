'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';

interface PermissionsData {
  allowComments: boolean;
  allowDownloads: boolean;
  trackCompletion: boolean;
  requireCompletion: boolean;
}
interface AdvancedSettingsData {
  prerequisite: string;
  completionCriteria: string;
}
interface LessonSettingsData {
  permissions: PermissionsData;
  advanced: AdvancedSettingsData;
}

const placeholderData: LessonSettingsData = {
  permissions: {
    allowComments: true,
    allowDownloads: false,
    trackCompletion: true,
    requireCompletion: true,
  },
  advanced: {
    prerequisite: 'none',
    completionCriteria: 'video-viewed',
  },
};

function LessonPermissions({ data }: { data: PermissionsData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lesson Permissions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="allow-comments">Allow Student Comments</Label>
          <Switch id="allow-comments" defaultChecked={data.allowComments} />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="allow-downloads">Allow Downloads</Label>
          <Switch id="allow-downloads" defaultChecked={data.allowDownloads} />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="track-completion">Track Completion</Label>
          <Switch id="track-completion" defaultChecked={data.trackCompletion} />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="require-completion">Require Completion</Label>
          <Switch
            id="require-completion"
            defaultChecked={data.requireCompletion}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function LessonPermissionsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-40" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-6 w-11 rounded-full" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-6 w-11 rounded-full" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-6 w-11 rounded-full" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-6 w-11 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

function AdvancedSettings({ data }: { data: AdvancedSettingsData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Advanced Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1.5">
          <Label>Prerequisite Lessons</Label>
          <Select defaultValue={data.prerequisite}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="lesson-1">Lesson 1: Introduction</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Completion Criteria</Label>
          <Select defaultValue={data.completionCriteria}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="video-viewed">Video is viewed</SelectItem>
              <SelectItem value="quiz-passed">Quiz is passed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

function AdvancedSettingsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-48" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-10 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

interface LessonSettingsTabProps {
  data?: LessonSettingsData;
}

export function LessonSettingsTab({
  data = placeholderData,
}: LessonSettingsTabProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <LessonPermissions data={data.permissions} />
      <AdvancedSettings data={data.advanced} />
    </div>
  );
}

export function LessonSettingsTabSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <LessonPermissionsSkeleton />
      <AdvancedSettingsSkeleton />
    </div>
  );
}
