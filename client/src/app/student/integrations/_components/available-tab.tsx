'use client';

import { ExternalLink } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  allIntegrations,
  IntegrationDetails,
  IntegrationProvider,
} from '../config/integrations.config';
import {
  useConnectGmail,
  useConnectGoogleCalendar,
  useConnectGoogleDrive,
  useGetIntegrations,
} from '../hooks/useIntegrations';

function IntegrationCard({ details }: { details: IntegrationDetails }) {
  const { mutate: connectCalendar, isPending: isConnectingCalendar } =
    useConnectGoogleCalendar();
  const { mutate: connectDrive, isPending: isConnectingDrive } =
    useConnectGoogleDrive();
  const { mutate: connectGmail, isPending: isConnectingGmail } =
    useConnectGmail();

  const isPending =
    isConnectingCalendar || isConnectingDrive || isConnectingGmail;

  const handleConnect = (provider: IntegrationProvider) => {
    const actions = {
      google_calendar: connectCalendar,
      google_drive: connectDrive,
      gmail: connectGmail,
    };

    const action = actions[provider as keyof typeof actions];

    if (action) {
      action(undefined, {
        onSuccess: (result) => {
          if (result.data) window.location.href = result.data.redirectUrl;
          else toast.error(result.error);
        },

        onError: (err) => toast.error(err.message),
      });
    } else {
      toast.info(`${details.name} integration is coming soon!`);
    }
  };

  return (
    <Card className="">
      <CardContent className="flex flex-1 flex-col">
        <div className="flex flex-1 items-start gap-3">
          <details.icon className="text-muted-foreground mt-0.5 h-5 w-5" />

          <div>
            <h3 className="font-semibold">{details.name}</h3>
            <p className="text-muted-foreground text-sm">
              {details.description}
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          className="mt-4 w-full"
          onClick={() => handleConnect(details.provider)}
          disabled={isPending}
        >
          <ExternalLink className="h-4 w-4" />
          {isPending ? 'Redirecting...' : 'Connect'}
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
  const { data: connectedIntegrations, isLoading } = useGetIntegrations();

  if (isLoading) {
    return <AvailableTabSkeleton />;
  }

  const connectedProviders = new Set(
    connectedIntegrations?.map((i) => i.provider)
  );
  const availableIntegrations = allIntegrations.filter(
    (details) => !connectedProviders.has(details.provider)
  );

  if (availableIntegrations.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed">
        <p className="text-muted-foreground">
          All available applications are connected.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {availableIntegrations.map((integration) => (
        <IntegrationCard key={integration.provider} details={integration} />
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
