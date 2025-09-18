'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ExternalLink, Plug, Sparkles } from 'lucide-react';

interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'success' | 'info';
}

function EmptyStateBase({
  icon: Icon,
  title,
  description,
  action,
  variant = 'default',
}: EmptyStateProps) {
  const getIconStyles = () => {
    switch (variant) {
      case 'success':
        return 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400';
      case 'info':
        return 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Card className="border-muted-foreground/25 border-2 border-dashed">
      <CardContent className="flex flex-col items-center justify-center px-8 py-12">
        <div className={`mb-4 rounded-full p-4 ${getIconStyles()}`}>
          <Icon className="h-8 w-8" />
        </div>

        <h3 className="mb-2 text-center text-lg font-semibold">{title}</h3>

        <p className="text-muted-foreground mb-4 max-w-sm text-center">
          {description}
        </p>

        {action && (
          <Button onClick={action.onClick} variant="outline" className="mt-2">
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function NoConnectedAppsState({
  onGoToAvailable,
}: {
  onGoToAvailable?: () => void;
}) {
  return (
    <EmptyStateBase
      icon={Plug}
      title="No Connected Applications"
      description="You haven't connected any applications yet. Head to the Available tab to start connecting your favorite tools and streamline your workflow."
      action={
        onGoToAvailable
          ? {
              label: 'Browse Available Apps',
              onClick: onGoToAvailable,
            }
          : undefined
      }
    />
  );
}

export function AllAppsConnectedState() {
  return (
    <EmptyStateBase
      icon={CheckCircle}
      title="All Set!"
      description="You've connected all available applications. Check back later for new integrations or manage your existing connections."
      variant="success"
    />
  );
}

export function NoAvailableAppsState() {
  return (
    <EmptyStateBase
      icon={Sparkles}
      title="Coming Soon"
      description="We're working on bringing you more integrations. Stay tuned for exciting new ways to connect your favorite tools."
      variant="info"
    />
  );
}

export function LoadingEmptyState() {
  return (
    <EmptyStateBase
      icon={ExternalLink}
      title="Loading Integrations"
      description="Please wait while we fetch your integration data..."
    />
  );
}
