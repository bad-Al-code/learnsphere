'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Settings, X } from 'lucide-react';
import { useState } from 'react';

interface SettingsPanelProps {
  onClose: () => void;
}

export function SettingsPanel({ onClose }: SettingsPanelProps) {
  const [subtitles, setSubtitles] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [subtitleSize, setSubtitleSize] = useState('medium');
  const [playbackSpeed, setPlaybackSpeed] = useState('1');

  return (
    <div className="border-border bg-card flex w-80 flex-col border-l">
      {/* Header */}
      <div className="border-border flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <h3 className="text-foreground font-semibold">Settings</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Settings */}
      <div className="flex-1 overflow-auto">
        <div className="space-y-4 p-4">
          {/* Video Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Video Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="subtitles" className="text-sm">
                  Subtitles
                </Label>
                <Switch
                  id="subtitles"
                  checked={subtitles}
                  onCheckedChange={setSubtitles}
                />
              </div>

              {subtitles && (
                <div className="space-y-2">
                  <Label
                    htmlFor="subtitle-size"
                    className="text-muted-foreground text-xs"
                  >
                    Subtitle Size
                  </Label>
                  <Select value={subtitleSize} onValueChange={setSubtitleSize}>
                    <SelectTrigger id="subtitle-size" className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-center justify-between">
                <Label htmlFor="autoplay" className="text-sm">
                  Auto-play Next Lesson
                </Label>
                <Switch
                  id="autoplay"
                  checked={autoPlay}
                  onCheckedChange={setAutoPlay}
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="playback-speed"
                  className="text-muted-foreground text-xs"
                >
                  Default Playback Speed
                </Label>
                <Select value={playbackSpeed} onValueChange={setPlaybackSpeed}>
                  <SelectTrigger id="playback-speed" className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">0.5x</SelectItem>
                    <SelectItem value="1">1x</SelectItem>
                    <SelectItem value="1.5">1.5x</SelectItem>
                    <SelectItem value="2">2x</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications" className="text-sm">
                  Enable Notifications
                </Label>
                <Switch
                  id="notifications"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>

              {notifications && (
                <>
                  <div className="flex items-center justify-between">
                    <Label className="text-muted-foreground text-xs">
                      Assignment Due
                    </Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-muted-foreground text-xs">
                      New Lesson
                    </Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-muted-foreground text-xs">
                      Feedback
                    </Label>
                    <Switch defaultChecked />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Accessibility */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Accessibility</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm">High Contrast</Label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm">Reduce Motion</Label>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
