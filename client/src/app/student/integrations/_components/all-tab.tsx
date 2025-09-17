'use client';

import {
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Cloud,
  Database,
  ExternalLink,
  FileText,
  Mail,
  Send,
  Settings,
  Slack,
  Sparkles,
  TriangleAlert,
  Users,
  XCircle,
} from 'lucide-react';
import React from 'react';

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
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';

type TStat = {
  label: string;
  value: string;
  icon: React.ElementType;
};

type TConnectionStatus = 'connected' | 'syncing' | 'disconnected';

type TIntegration = {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  status: TConnectionStatus;
  lastSync?: string;
  tags: string[];
};

type TIntegrationCategory = {
  id: string;
  title: string;
  icon: React.ElementType;
  integrations: TIntegration[];
};

const statsData: TStat[] = [
  { label: 'Connected', value: '5', icon: Database },
  { label: 'Active', value: '4', icon: CheckCircle },
  { label: 'Last Sync', value: '5m ago', icon: Clock },
];

const integrationsData: TIntegrationCategory[] = [
  {
    id: 'cat1',
    title: 'Calendar & Scheduling',
    icon: Calendar,
    integrations: [
      {
        id: 'int1',
        name: 'Google Calendar',
        icon: Calendar,
        description:
          'Sync assignments and study sessions with your Google Calendar',
        status: 'connected',
        lastSync: '5m ago',
        tags: [
          'Assignment deadlines',
          'Study sessions',
          'Class schedules',
          '+1 more',
        ],
      },
      {
        id: 'int2',
        name: 'Outlook Calendar',
        icon: Calendar,
        description: 'Integrate with Microsoft Outlook for seamless scheduling',
        status: 'disconnected',
        tags: ['Assignment deadlines', 'Study sessions', 'Meeting integration'],
      },
    ],
  },
  {
    id: 'cat2',
    title: 'Email & Notifications',
    icon: Mail,
    integrations: [
      {
        id: 'int3',
        name: 'Gmail',
        icon: Mail,
        description: 'Receive assignment notifications and updates via email',
        status: 'connected',
        lastSync: '2m ago',
        tags: [
          'Assignment notifications',
          'Grade updates',
          'Course announcements',
        ],
      },
    ],
  },
  {
    id: 'cat3',
    title: 'Cloud Storage',
    icon: Cloud,
    integrations: [
      {
        id: 'int4',
        name: 'Google Drive',
        icon: Cloud,
        description: 'Store and access your assignments and course materials',
        status: 'connected',
        lastSync: 'Just now',
        tags: ['File storage', 'Document sharing', 'Automatic backup'],
      },
      {
        id: 'int5',
        name: 'Dropbox',
        icon: Cloud,
        description: 'Sync files and collaborate on projects',
        status: 'disconnected',
        tags: ['File sync', 'Team collaboration', 'Version control'],
      },
    ],
  },
  {
    id: 'cat4',
    title: 'Learning Management',
    icon: BookOpen,
    integrations: [
      {
        id: 'int6',
        name: 'Canvas LMS',
        icon: BookOpen,
        description: 'Import courses, assignments, and grades from Canvas',
        status: 'syncing',
        lastSync: '16m ago',
        tags: ['Course import', 'Assignment sync', 'Grade tracking', '+1 more'],
      },
      {
        id: 'int7',
        name: 'Blackboard Learn',
        icon: BookOpen,
        description: 'Connect with Blackboard for course management',
        status: 'disconnected',
        tags: ['Course content', 'Assignment submission', 'Grade book'],
      },
      {
        id: 'int8',
        name: 'Moodle',
        icon: BookOpen,
        description: 'Integrate with Moodle learning platform',
        status: 'disconnected',
        tags: ['Course materials', 'Quiz integration', 'Forum discussions'],
      },
    ],
  },
  {
    id: 'cat5',
    title: 'Communication',
    icon: Users,
    integrations: [
      {
        id: 'int9',
        name: 'Slack',
        icon: Slack,
        description: 'Get study group notifications and updates',
        status: 'connected',
        lastSync: '31m ago',
        tags: ['Study group chat', 'Assignment reminders', 'Collaboration'],
      },
    ],
  },
  {
    id: 'cat6',
    title: 'Productivity Tools',
    icon: Sparkles,
    integrations: [
      {
        id: 'int10',
        name: 'Notion',
        icon: FileText,
        description: 'Sync notes and study materials with Notion',
        status: 'disconnected',
        tags: ['Note taking', 'Task management', 'Knowledge base'],
      },
    ],
  },
];

function IntegrationCard({ integration }: { integration: TIntegration }) {
  const isConnected =
    integration.status === 'connected' || integration.status === 'syncing';

  return (
    <Card className="">
      <CardHeader>
        <div className="flex items-center gap-2">
          <integration.icon className="text-muted-foreground h-5 w-5" />
          <h3 className="font-semibold">{integration.name}</h3>
          {integration.status === 'connected' && (
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          )}
          {integration.status === 'syncing' && (
            <TriangleAlert className="h-4 w-4 text-blue-500" />
          )}
        </div>
        <CardDescription>{integration.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 space-y-3">
        <div className="flex items-center gap-2 text-xs">
          {integration.status === 'connected' && (
            <Badge
              variant="outline"
              className="border-emerald-500 text-emerald-500"
            >
              Connected
            </Badge>
          )}
          {integration.status === 'syncing' && (
            <Badge variant="outline" className="border-blue-500 text-blue-500">
              Syncing...
            </Badge>
          )}
          {integration.status === 'disconnected' && (
            <Badge variant="destructive">Disconnected</Badge>
          )}
          {integration.lastSync && (
            <p className="text-muted-foreground">
              Last sync: {integration.lastSync}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {integration.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter>
        {isConnected ? (
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
            >
              <Switch defaultChecked />
              <label className="text-sm">Enabled</label>
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
              <Button variant="outline" size="sm">
                <XCircle className="h-4 w-4" />
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="secondary" className="w-full">
            <ExternalLink className="h-4 w-4" /> Connect
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function IntegrationCategoryCard({
  category,
}: {
  category: TIntegrationCategory;
}) {
  const connectedCount = category.integrations.filter(
    (i) => i.status !== 'disconnected'
  ).length;
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <category.icon className="h-5 w-5" />
          <CardTitle>{category.title}</CardTitle>
        </div>
        <CardDescription>
          {connectedCount} of {category.integrations.length} connected
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        {category.integrations.map((integration) => (
          <IntegrationCard key={integration.id} integration={integration} />
        ))}
      </CardContent>
    </Card>
  );
}

function IntegrationCardSkeleton() {
  return (
    <Card className="">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        <Skeleton className="h-6 w-24" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-24" />
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}

function IntegrationCategoryCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="mt-2 h-4 w-1/4" />
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        <IntegrationCardSkeleton />
        <IntegrationCardSkeleton />
      </CardContent>
    </Card>
  );
}

export function AllTab() {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <p className="text-muted-foreground text-sm">{stat.label}</p>
              <div className="mt-1 flex items-center gap-2">
                <stat.icon className="text-muted-foreground h-5 w-5" />
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="flex items-center justify-center">
          <CardContent className="p-4">
            <Button variant="secondary" className="w-full">
              <Send className="h-4 w-4" />
              Sync All
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        {integrationsData.map((category) => (
          <IntegrationCategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}

export function AllTabSkeleton() {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="">
              <div className="space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-8 w-1/3" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="space-y-4">
        <IntegrationCategoryCardSkeleton />
        <IntegrationCategoryCardSkeleton />
      </div>
    </div>
  );
}
