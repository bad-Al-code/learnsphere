'use client';

import { Badge } from '@/components/ui/badge';
import {
  allIntegrations,
  categories,
  IntegrationDetails,
} from '../config/integrations.config';
import { useGetIntegrations } from '../hooks/useIntegrations';
import { AvailableTabSkeleton } from '../skeletons/available-tab-skeleton';
import { AllAppsConnectedState } from './empty-states';
import { IntegrationCard } from './integration-card';

function CategorySection({
  categoryTitle,
  integrations,
  connectedProviders,
}: {
  categoryTitle: string;
  integrations: IntegrationDetails[];
  connectedProviders: Set<string>;
}) {
  const availableCount = integrations.filter(
    (integration) => !connectedProviders.has(integration.provider)
  ).length;

  if (availableCount === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">{categoryTitle}</h3>
        <Badge variant="outline" className="text-xs">
          {availableCount} available
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {integrations
          .filter(
            (integration) => !connectedProviders.has(integration.provider)
          )
          .map((integration) => (
            <IntegrationCard key={integration.provider} details={integration} />
          ))}
      </div>
    </div>
  );
}
export function AvailableTab() {
  const { data: connectedIntegrations, isLoading } = useGetIntegrations();

  if (isLoading) {
    return <AvailableTabSkeleton />;
  }

  const connectedProviders = new Set(
    connectedIntegrations?.map((i) => i.provider) || []
  );

  const availableIntegrations = allIntegrations.filter(
    (details) => !connectedProviders.has(details.provider)
  );

  if (availableIntegrations.length === 0) {
    return <AllAppsConnectedState />;
  }

  const totalAvailable = availableIntegrations.length;
  const readyToConnect = availableIntegrations.filter((integration) =>
    ['google_calendar', 'google_drive', 'gmail'].includes(integration.provider)
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Available Integrations</h2>

          <p className="text-muted-foreground text-sm">
            Connect {totalAvailable} new service
            {totalAvailable !== 1 ? 's' : ''} to enhance your workflow
          </p>
        </div>

        <div className="flex gap-2">
          <Badge variant="secondary">{readyToConnect} ready now</Badge>
          <Badge variant="outline">
            {totalAvailable - readyToConnect} coming soon
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(categories).map(([categoryTitle, integrations]) => (
          <CategorySection
            key={categoryTitle}
            categoryTitle={categoryTitle}
            integrations={integrations}
            connectedProviders={connectedProviders}
          />
        ))}
      </div>
    </div>
  );
}
