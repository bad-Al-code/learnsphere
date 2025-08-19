'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';

interface SettingsData {
  enableSubtitles: boolean;
  allowDownload: boolean;
  autoPlayNext: boolean;
  trackWatchTime: boolean;
}

interface VideoPlayerSettingsProps {
  data?: SettingsData;
}

const placeholderData: SettingsData = {
  enableSubtitles: false,
  allowDownload: false,
  autoPlayNext: false,
  trackWatchTime: true,
};

function SettingsSwitch({
  id,
  label,
  description,
  isChecked,
}: {
  id: string;
  label: string;
  description: string;
  isChecked: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="space-y-0.5">
        <Label htmlFor={id} className="text-base font-medium">
          {label}
        </Label>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <Switch id={id} defaultChecked={isChecked} />
    </div>
  );
}

export function VideoPlayerSettings({
  data = placeholderData,
}: VideoPlayerSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Video Player Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SettingsSwitch
          id="enable-subtitles"
          label="Enable Subtitles"
          description="Allow students to toggle subtitles"
          isChecked={data.enableSubtitles}
        />
        <SettingsSwitch
          id="allow-download"
          label="Allow Download"
          description="Students can download video for offline viewing"
          isChecked={data.allowDownload}
        />
        <SettingsSwitch
          id="auto-play-next"
          label="Auto-play Next"
          description="Automatically play next lesson when video ends"
          isChecked={data.autoPlayNext}
        />
        <SettingsSwitch
          id="track-watch-time"
          label="Track Watch Time"
          description="Monitor student engagement and completion"
          isChecked={data.trackWatchTime}
        />
      </CardContent>
    </Card>
  );
}

function SettingsSwitchSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div className="space-y-1">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-56" />
      </div>
      <Skeleton className="h-6 w-11 rounded-full" />
    </div>
  );
}

export function VideoPlayerSettingsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-48" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SettingsSwitchSkeleton />
        <SettingsSwitchSkeleton />
        <SettingsSwitchSkeleton />
        <SettingsSwitchSkeleton />
      </CardContent>
    </Card>
  );
}
