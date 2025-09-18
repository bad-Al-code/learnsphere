'use client';

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
import { Switch } from '@/components/ui/switch';
import { CheckCircle, ExternalLink, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  IntegrationDetails,
  IntegrationProvider,
} from '../config/integrations.config';
import {
  useConnectGmail,
  useConnectGoogleCalendar,
  useConnectGoogleDrive,
  useDeleteIntegration,
} from '../hooks/useIntegrations';
import { PublicIntegration } from '../schema/integration.schema';

export interface IntegrationCardProps {
  details: IntegrationDetails;
  integration?: PublicIntegration;
  variant?: 'default' | 'compact' | 'detailed';
}

interface ConnectedActionsProps {
  integration: PublicIntegration;
  onDisconnect: () => void;
  isPending: boolean;
  variant?: 'default' | 'compact';
}

interface DisconnectedActionsProps {
  provider: IntegrationProvider;
  onConnect: (provider: IntegrationProvider) => void;
  isPending: boolean;
  variant?: 'default' | 'compact';
}

function ConnectedActions({
  integration,
  onDisconnect,
  isPending,
  variant = 'default',
}: ConnectedActionsProps) {
  if (variant === 'compact') {
    return (
      <Button
        variant="destructive"
        size="sm"
        onClick={onDisconnect}
        disabled={isPending}
        className="flex items-center gap-1"
      >
        <XCircle className="h-4 w-4" />
        {isPending ? 'Disconnecting...' : 'Disconnect'}
      </Button>
    );
  }

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-2">
        <Switch
          checked={integration.status === 'active'}
          disabled
          className="data-[state=checked]:bg-emerald-500"
        />

        <span className="text-muted-foreground text-sm">
          {integration.status === 'active' ? 'Enabled' : 'Disabled'}
        </span>
      </div>

      <Button
        variant="destructive"
        size="sm"
        onClick={onDisconnect}
        disabled={isPending}
        className="flex items-center gap-1"
      >
        <XCircle className="h-4 w-4" />
        {isPending ? 'Disconnecting...' : 'Disconnect'}
      </Button>
    </div>
  );
}

function DisconnectedActions({
  provider,
  onConnect,
  isPending,
  variant = 'default',
}: DisconnectedActionsProps) {
  const isAvailable = ['google_calendar', 'google_drive', 'gmail'].includes(
    provider
  );

  return (
    <Button
      variant={variant === 'compact' ? 'default' : 'outline'}
      className={`flex w-full items-center gap-2`}
      onClick={() => onConnect(provider)}
      disabled={isPending || !isAvailable}
    >
      <ExternalLink className="h-4 w-4" />

      {isPending ? 'Connecting...' : isAvailable ? 'Connect' : 'Coming Soon'}
    </Button>
  );
}

export function IntegrationCard({
  details,
  integration,
  variant = 'default',
}: IntegrationCardProps) {
  const { mutate: connectCalendar, isPending: isConnectingCalendar } =
    useConnectGoogleCalendar();
  const { mutate: connectDrive, isPending: isConnectingDrive } =
    useConnectGoogleDrive();
  const { mutate: connectGmail, isPending: isConnectingGmail } =
    useConnectGmail();
  const { mutate: deleteIntegration, isPending: isDeleting } =
    useDeleteIntegration();

  const isPending =
    isConnectingCalendar ||
    isConnectingDrive ||
    isConnectingGmail ||
    isDeleting;

  const handleConnect = (provider: IntegrationProvider) => {
    const connectActions = {
      google_calendar: connectCalendar,
      google_drive: connectDrive,
      gmail: connectGmail,
    };

    const action = connectActions[provider as keyof typeof connectActions];

    if (action) {
      action(undefined, {
        onSuccess: (result) => {
          if (result.data) {
            window.location.href = result.data.redirectUrl;
          } else {
            toast.error(result.error);
          }
        },

        onError: (err) => toast.error(err.message),
      });
    } else {
      toast.info(`${details.name} integration is coming soon!`, {
        description: "We're working hard to bring this integration to you.",
      });
    }
  };

  const handleDisconnect = () => {
    if (!integration) return;

    deleteIntegration(integration.id, {
      onSuccess: () => toast.success(`${details.name} has been disconnected.`),
      onError: (err) => toast.error(err.message),
    });
  };

  if (variant === 'compact') {
    return (
      <Card className="transition-all hover:shadow-md">
        <CardContent className="">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex-shrink-0 rounded-lg p-2">
              <details.icon className="text-primary h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="truncate font-medium">{details.name}</h3>
                {integration?.status === 'active' && (
                  <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                )}
              </div>
            </div>

            <div className="flex-shrink-0">
              {integration ? (
                <ConnectedActions
                  integration={integration}
                  onDisconnect={handleDisconnect}
                  isPending={isPending}
                  variant="compact"
                />
              ) : (
                <DisconnectedActions
                  provider={details.provider}
                  onConnect={handleConnect}
                  isPending={isPending}
                  variant="compact"
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex h-full flex-col transition-all hover:shadow-md">
      <CardHeader className="">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <details.icon className="text-primary h-6 w-6" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="truncate text-base">
                {details.name}
              </CardTitle>

              {integration?.status === 'active' && (
                <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-500" />
              )}
            </div>

            <CardDescription className="mt-1 line-clamp-2 text-sm">
              {details.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        {integration ? (
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-emerald-500 text-emerald-500"
            >
              Connected
            </Badge>

            {integration.status === 'active' && (
              <Badge variant="secondary" className="text-xs">
                Active
              </Badge>
            )}
          </div>
        ) : (
          <Badge variant="secondary">Not Connected</Badge>
        )}
      </CardContent>

      <CardFooter className="mt-auto">
        {integration ? (
          <ConnectedActions
            integration={integration}
            onDisconnect={handleDisconnect}
            isPending={isPending}
          />
        ) : (
          <DisconnectedActions
            provider={details.provider}
            onConnect={handleConnect}
            isPending={isPending}
          />
        )}
      </CardFooter>
    </Card>
  );
}
