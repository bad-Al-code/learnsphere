'use client';

import { CheckCircle, TriangleAlert, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from 'sonner';
import {
  allIntegrations,
  IntegrationDetails,
} from '../config/integrations.config';
import {
  useDeleteIntegration,
  useGetIntegrations,
} from '../hooks/useIntegrations';
import { PublicIntegration } from '../schema/integration.schema';

function ConnectedAppCard({
  integration,
  details,
}: {
  integration: PublicIntegration;
  details: IntegrationDetails;
}) {
  const { mutate: deleteIntegration, isPending } = useDeleteIntegration();

  const handleDisconnect = () => {
    deleteIntegration(integration.id, {
      onSuccess: () => toast.success(`${details.name} has been disconnected.`),
      onError: (err) => toast.error(err.message),
    });
  };

  return (
    <Card>
      <CardContent className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <details.icon className="text-muted-foreground h-5 w-5 shrink-0" />
          <div>
            <h3 className="font-semibold">{details.name}</h3>
            <p className="text-muted-foreground text-xs">
              Last updated:{' '}
              {new Date(integration.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              {integration.status === 'active' ? (
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              ) : (
                <TriangleAlert className="h-5 w-5 text-yellow-500" />
              )}
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Status:{' '}
                {integration.status === 'active' ? 'Active' : 'Inactive'}
              </p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center">
                <Switch
                  defaultChecked={integration.status === 'active'}
                  disabled
                />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {integration.status === 'active'
                  ? 'Integration is enabled'
                  : 'Integration is disabled'}
              </p>
            </TooltipContent>
          </Tooltip>

          <Button
            onClick={handleDisconnect}
            disabled={isPending}
            variant="destructive"
            size="sm"
          >
            <XCircle className="h-4 w-4" />
            Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ConnectedAppCardSkeleton() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Left side (icon + text) */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-6 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        {/* Right side (status + switch + button) */}
        <div className="flex items-center gap-3">
          <Skeleton className="h-5 w-5 rounded-full" /> {/* status icon */}
          <Skeleton className="h-6 w-11 rounded-full" /> {/* switch */}
          <Skeleton className="h-8 w-24 rounded-md" /> {/* disconnect button */}
        </div>
      </CardContent>
    </Card>
  );
}

export function ConnectedTab() {
  const { data: connectedIntegrations, isLoading } = useGetIntegrations();

  if (isLoading) {
    return <ConnectedTabSkeleton />;
  }

  if (!connectedIntegrations || connectedIntegrations.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed">
        <p className="text-muted-foreground">
          No connected applications found.
        </p>
      </div>
    );
  }

  const connectedProviders = new Set(
    connectedIntegrations.map((i) => i.provider)
  );
  const integrationsToShow = allIntegrations.filter((details) =>
    connectedProviders.has(details.provider)
  );

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {integrationsToShow.map((details) => {
        const integrationData = connectedIntegrations.find(
          (i) => i.provider === details.provider
        )!;
        return (
          <ConnectedAppCard
            key={details.provider}
            integration={integrationData}
            details={details}
          />
        );
      })}
    </div>
  );
}

export function ConnectedTabSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <ConnectedAppCardSkeleton key={i} />
      ))}
    </div>
  );
}
