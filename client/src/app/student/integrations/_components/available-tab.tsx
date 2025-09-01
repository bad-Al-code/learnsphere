'use client';

import {
  BookOpen,
  Calendar,
  Cloud,
  ExternalLink,
  FileText,
} from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type TIntegration = {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
};

const integrationsData: TIntegration[] = [
  {
    id: '1',
    name: 'Outlook Calendar',
    description: 'Integrate with Microsoft Outlook for seamless scheduling',
    icon: Calendar,
  },
  {
    id: '2',
    name: 'Dropbox',
    description: 'Sync files and collaborate on projects',
    icon: Cloud,
  },
  {
    id: '3',
    name: 'Blackboard Learn',
    description: 'Connect with Blackboard for course management',
    icon: BookOpen,
  },
  {
    id: '4',
    name: 'Moodle',
    description: 'Integrate with Moodle learning platform',
    icon: BookOpen,
  },
  {
    id: '5',
    name: 'Notion',
    description: 'Sync notes and study materials with Notion',
    icon: FileText,
  },
];

function IntegrationCard({ integration }: { integration: TIntegration }) {
  return (
    <Card className="">
      <CardContent className="flex flex-1 flex-col">
        <div className="flex flex-1 items-start gap-3">
          <integration.icon className="text-muted-foreground mt-1 h-5 w-5" />
          <div>
            <h3 className="font-semibold">{integration.name}</h3>
            <p className="text-muted-foreground text-sm">
              {integration.description}
            </p>
          </div>
        </div>
        <Button variant="secondary" className="mt-4 w-full">
          <ExternalLink className="h-4 w-4" />
          Connect
        </Button>
      </CardContent>
    </Card>
  );
}

function IntegrationCardSkeleton() {
  return (
    <Card className="flex h-full flex-col">
      <CardContent className="flex flex-1 flex-col">
        <div className="flex flex-1 items-start gap-3">
          <Skeleton className="h-6 w-6" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
        <Skeleton className="mt-4 h-10 w-full" />
      </CardContent>
    </Card>
  );
}

export function AvailableTab() {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {integrationsData.map((integration) => (
        <IntegrationCard key={integration.id} integration={integration} />
      ))}
    </div>
  );
}

export function AvailableTabSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <IntegrationCardSkeleton key={i} />
      ))}
    </div>
  );
}
