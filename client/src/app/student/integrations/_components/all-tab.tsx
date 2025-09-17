'use client';

import { CheckCircle, ExternalLink, XCircle } from 'lucide-react';

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
import { toast } from 'sonner';
import {
  allIntegrations,
  categories,
  IntegrationDetails,
  IntegrationProvider,
} from '../config/integrations.config';
import {
  useConnectGoogle,
  useDeleteIntegration,
  useGetIntegrations,
} from '../hooks/useIntegrations';
import { PublicIntegration } from '../schema/integration.schema';

function IntegrationCard({
  details,
  integration,
}: {
  details: IntegrationDetails;
  integration: PublicIntegration | undefined;
}) {
  const { mutate: connectGoogle, isPending: isConnecting } = useConnectGoogle();
  const { mutate: deleteIntegration, isPending: isDeleting } =
    useDeleteIntegration();

  const handleConnect = (provider: IntegrationProvider) => {
    if (provider === 'google_calendar') {
      connectGoogle(undefined, {
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

  const handleDisconnect = () => {
    if (!integration) return;

    deleteIntegration(integration.id, {
      onSuccess: () => toast.success(`${details.name} has been disconnected.`),
      onError: (err) => toast.error(err.message),
    });
  };

  const isPending = isConnecting || isDeleting;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <details.icon className="text-muted-foreground h-5 w-5" />
          <h3 className="font-semibold">{details.name}</h3>
          {integration?.status === 'active' && (
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          )}
        </div>
        <CardDescription>{details.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {integration ? (
          <Badge
            variant="outline"
            className="border-emerald-500 text-emerald-500"
          >
            Connected
          </Badge>
        ) : (
          <Badge variant="secondary">Not Connected</Badge>
        )}
      </CardContent>
      <CardFooter>
        {integration ? (
          <div className="flex w-full items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="pointer-events-none flex items-center gap-2"
            >
              <Switch checked={true} disabled />
              <label className="text-sm">Enabled</label>
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDisconnect}
              disabled={isPending}
            >
              <XCircle className="h-4 w-4" />
              Disconnect
            </Button>
          </div>
        ) : (
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => handleConnect(details.provider)}
            disabled={isPending}
          >
            <ExternalLink className="h-4 w-4" />
            {isConnecting ? 'Redirecting...' : 'Connect'}
          </Button>
        )}
      </CardFooter>
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
  const { data: connectedIntegrations, isLoading } = useGetIntegrations();

  if (isLoading) {
    return <AllTabSkeleton />;
  }

  const connectedMap = new Map(
    connectedIntegrations?.map((i) => [i.provider, i])
  );

  const stats = {
    connected: connectedIntegrations?.length || 0,
    active:
      connectedIntegrations?.filter((i) => i.status === 'active').length || 0,
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground text-sm">Total Connected</p>
            <p className="text-2xl font-bold">{stats.connected}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground text-sm">Actively Synced</p>
            <p className="text-2xl font-bold">{stats.active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground text-sm">
              Integrations Available
            </p>
            <p className="text-2xl font-bold">{allIntegrations.length}</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-2">
        {Object.entries(categories).map(([categoryTitle, integrations]) => (
          <Card key={categoryTitle}>
            <CardHeader>
              <CardTitle>{categoryTitle}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {integrations.map((details) => (
                <IntegrationCard
                  key={details.provider}
                  details={details}
                  integration={connectedMap.get(details.provider)}
                />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function AllTabSkeleton() {
  return (
    <div className="space-y-4">
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
