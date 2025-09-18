'use client';

import { Badge } from '@/components/ui/badge';
import { allIntegrations } from '../config/integrations.config';
import { useGetIntegrations } from '../hooks/useIntegrations';
import { ConnectedTabSkeleton } from '../skeletons/connected-tab-skeleton';
import { NoConnectedAppsState } from './empty-states';
import { IntegrationCard } from './integration-card';

export function ConnectedTab() {
  const { data: connectedIntegrations, isLoading } = useGetIntegrations();

  if (isLoading) {
    return <ConnectedTabSkeleton />;
  }

  if (!connectedIntegrations || connectedIntegrations.length === 0) {
    return <NoConnectedAppsState />;
  }

  const connectedProviders = new Set(
    connectedIntegrations.map((i) => i.provider)
  );

  const integrationsToShow = allIntegrations.filter((details) =>
    connectedProviders.has(details.provider)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Connected Applications</h2>
          <p className="text-muted-foreground text-sm">
            Manage your {connectedIntegrations.length} connected integration
            {connectedIntegrations.length !== 1 ? 's' : ''}
          </p>
        </div>

        <Badge variant="secondary" className="text-sm">
          {connectedIntegrations.filter((i) => i.status === 'active').length}{' '}
          active
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {integrationsToShow.map((details) => {
          const integrationData = connectedIntegrations.find(
            (i) => i.provider === details.provider
          )!;

          return (
            <IntegrationCard
              key={details.provider}
              details={details}
              integration={integrationData}
            />
          );
        })}
      </div>
    </div>
  );
}
