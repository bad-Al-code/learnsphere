'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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

interface SettingsData {
  title: string;
  duration: string;
  status: 'Published' | 'Draft';
  allowComments: boolean;
  trackCompletion: boolean;
}

interface LessonSettingsProps {
  data?: SettingsData;
}

const placeholderData: SettingsData = {
  title: 'What is Data Science?',
  duration: '15 min',
  status: 'Published',
  allowComments: true,
  trackCompletion: true,
};

export function LessonSettings({
  data = placeholderData,
}: LessonSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lesson Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="lesson-title">Lesson Title</Label>
          <Input id="lesson-title" defaultValue={data.title} />
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="duration">Duration</Label>
          <Input id="duration" defaultValue={data.duration} />
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="status">Status</Label>
          <Select defaultValue={data.status}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Published">Published</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3">
          <Label htmlFor="allow-comments" className="font-medium">
            Allow Comments
          </Label>
          <Switch id="allow-comments" defaultChecked={data.allowComments} />
        </div>

        <div className="flex items-center justify-between rounded-lg border p-3">
          <Label htmlFor="track-completion" className="font-medium">
            Track Completion
          </Label>
          <Switch id="track-completion" defaultChecked={data.trackCompletion} />
        </div>
      </CardContent>
    </Card>
  );
}

export function LessonSettingsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-32" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-6 w-11 rounded-full" />
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-6 w-11 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
