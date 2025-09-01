'use client';

import { Columns, Grid, LayoutDashboard, LayoutGrid, List } from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type TLayoutAttribute = {
  icon?: React.ElementType;
  label: string;
};

type TLayoutOption = {
  id: string;
  name: string;
  description: string;
  attributes: TLayoutAttribute[];
  isActive: boolean;
};

const layoutOptionsData: TLayoutOption[] = [
  {
    id: 'lo1',
    name: 'Default Grid',
    description: 'Balanced grid layout with sidebar',
    attributes: [
      { icon: LayoutGrid, label: 'grid' },
      { label: '3 columns' },
      { label: 'normal spacing' },
    ],
    isActive: true,
  },
  {
    id: 'lo2',
    name: 'Compact List',
    description: 'Space-efficient list layout',
    attributes: [
      { icon: List, label: 'list' },
      { label: '1 column' },
      { label: 'tight spacing' },
    ],
    isActive: false,
  },
  {
    id: 'lo3',
    name: 'Wide Columns',
    description: 'Full-width column layout',
    attributes: [
      { icon: Columns, label: 'columns' },
      { label: '4 columns' },
      { label: 'loose spacing' },
    ],
    isActive: false,
  },
  {
    id: 'lo4',
    name: 'Masonry',
    description: 'Pinterest-style masonry layout',
    attributes: [
      { icon: Grid, label: 'masonry' },
      { label: '3 columns' },
      { label: 'normal spacing' },
    ],
    isActive: false,
  },
];

function LayoutCard({ layout }: { layout: TLayoutOption }) {
  return (
    <Card
      className={cn(
        'hover:border-primary/50 cursor-pointer',
        layout.isActive && 'border-primary'
      )}
    >
      <CardContent className="">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{layout.name}</h3>
            <p className="text-muted-foreground text-sm">
              {layout.description}
            </p>
          </div>
          {layout.isActive && <Badge>Active</Badge>}
        </div>
        <div className="text-muted-foreground mt-4 flex items-center gap-4 text-xs">
          {layout.attributes.map((attr) => (
            <span key={attr.label} className="flex items-center gap-1">
              {attr.icon && <attr.icon className="h-3 w-3" />}
              {attr.label}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function LayoutCardSkeleton() {
  return (
    <Card>
      <CardContent className="">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-4">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

export function LayoutTabSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="mt-2 h-4 w-1/2" />
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <LayoutCardSkeleton />
        <LayoutCardSkeleton />
        <LayoutCardSkeleton />
        <LayoutCardSkeleton />
      </CardContent>
    </Card>
  );
}

export function LayoutTab() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5" />
          <CardTitle>Dashboard Layout</CardTitle>
        </div>
        <CardDescription>
          Choose how your dashboard is organized
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {layoutOptionsData.map((layout) => (
          <LayoutCard key={layout.id} layout={layout} />
        ))}
      </CardContent>
    </Card>
  );
}
