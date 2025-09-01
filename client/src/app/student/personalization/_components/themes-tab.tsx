'use client';

import { Eye, Palette, Save, Wand2 } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

type TTheme = {
  id: string;
  name: string;
  description: string;
  colors: string[];
  isActive: boolean;
};

type TColorSetting = {
  label: string;
  value: string;
  swatchColor: string;
};

const predefinedThemes: TTheme[] = [
  {
    id: 't1',
    name: 'Default',
    description: 'Clean and modern purple theme',
    colors: ['#8b5cf6', '#3b82f6', '#f59e0b', '#ffffff', '#e5e7eb'],
    isActive: true,
  },
  {
    id: 't2',
    name: 'Dark Mode',
    description: 'Easy on the eyes dark theme',
    colors: ['#8b5cf6', '#3b82f6', '#f59e0b', '#ffffff', '#e5e7eb'],
    isActive: false,
  },
  {
    id: 't3',
    name: 'Ocean Blue',
    description: 'Calming blue and teal theme',
    colors: ['#06b6d4', '#14b8a6', '#f59e0b', '#ffffff', '#e5e7eb'],
    isActive: false,
  },
  {
    id: 't4',
    name: 'Forest Green',
    description: 'Natural green and earth tones',
    colors: ['#22c55e', '#16a34a', '#f59e0b', '#ffffff', '#e5e7eb'],
    isActive: false,
  },
  {
    id: 't5',
    name: 'Sunset Orange',
    description: 'Warm orange and red theme',
    colors: ['#f97316', '#ef4444', '#f59e0b', '#ffffff', '#e5e7eb'],
    isActive: false,
  },
];

const colorSettings: TColorSetting[] = [
  { label: 'Primary', value: '#8b5cf6', swatchColor: 'bg-[#8b5cf6]' },
  { label: 'Secondary', value: '#06b6d4', swatchColor: 'bg-[#06b6d4]' },
  { label: 'Accent', value: '#f59e0b', swatchColor: 'bg-[#f59e0b]' },
  { label: 'Background', value: '#ffffff', swatchColor: 'bg-[#ffffff]' },
  { label: 'Foreground', value: '#1f2937', swatchColor: 'bg-[#1f2937]' },
  { label: 'Muted', value: '#f3f4f6', swatchColor: 'bg-[#f3f4f6]' },
  { label: 'Border', value: '#e5e7eb', swatchColor: 'bg-[#e5e7eb]' },
];

function ThemeCard({ theme }: { theme: TTheme }) {
  return (
    <Card className={cn(theme.isActive && 'border-primary')}>
      <CardContent className="">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{theme.name}</h3>
            <p className="text-muted-foreground text-sm">{theme.description}</p>
          </div>
          {theme.isActive && <Badge>Active</Badge>}
        </div>
        <div className="mt-4 flex items-center gap-2">
          {theme.colors.map((color, i) => (
            <div
              key={i}
              className="h-5 w-5 rounded-full border"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ThemeSelection() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          <CardTitle>Theme Selection</CardTitle>
        </div>
        <CardDescription>
          Choose from predefined themes or create your own
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {predefinedThemes.map((theme) => (
          <ThemeCard key={theme.id} theme={theme} />
        ))}
      </CardContent>
    </Card>
  );
}

function CustomThemeBuilder() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wand2 className="h-5 w-5" />
          <CardTitle>Custom Theme Builder</CardTitle>
        </div>
        <CardDescription>Create your own personalized theme</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium">Theme Name</label>
            <Input defaultValue="My Custom Theme" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Border Radius</label>
            <div className="flex items-center gap-4">
              <Slider defaultValue={[8]} max={16} step={1} />
              <span className="text-muted-foreground w-8 text-sm">8px</span>
            </div>
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-medium">Description</label>
            <Input defaultValue="Your personalized theme" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {colorSettings.map((color) => (
            <div key={color.label} className="space-y-1">
              <label className="text-sm font-medium">{color.label}</label>
              <div className="flex items-center gap-2 rounded-md border p-2">
                <div
                  className={cn('h-6 w-6 rounded-md border', color.swatchColor)}
                />
                <Input
                  defaultValue={color.value}
                  className="flex-1 border-0 pl-2 focus-visible:ring-0"
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="gap-2">
        <Button>
          <Save className="h-4 w-4" />
          Save Custom Theme
        </Button>
        <Button variant="outline">
          <Eye className="h-4 w-4" />
          Preview
        </Button>
      </CardFooter>
    </Card>
  );
}

function ThemeSelectionSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="mt-2 h-4 w-3/4" />
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </CardContent>
    </Card>
  );
}

function CustomThemeBuilderSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="mt-2 h-4 w-2/3" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full md:col-span-2" />
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Skeleton className="h-10 w-44" />
        <Skeleton className="h-10 w-24" />
      </CardFooter>
    </Card>
  );
}

export function ThemesTab() {
  return (
    <div className="space-y-2">
      <ThemeSelection />
      <CustomThemeBuilder />
    </div>
  );
}

export function ThemesTabSkeleton() {
  return (
    <div className="space-y-2">
      <ThemeSelectionSkeleton />
      <CustomThemeBuilderSkeleton />
    </div>
  );
}
