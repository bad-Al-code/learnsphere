'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { categories, IntegrationDetails } from '../config/integrations.config';
import { useGetIntegrations } from '../hooks/useIntegrations';
import { PublicIntegration } from '../schema/integration.schema';
import { AllTabSkeleton } from '../skeletons/all-tab-skeleton';
import { IntegrationCard } from './integration-card';
import { IntegrationStats } from './integration-stats';

function CategorySection({
  categoryTitle,
  integrations,
  connectedMap,
}: {
  categoryTitle: string;
  integrations: IntegrationDetails[];
  connectedMap: Map<string, PublicIntegration>;
}) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          {categoryTitle}
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="ml-auto">
                {integrations.length}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              Total Integrations: {integrations.length}{' '}
            </TooltipContent>
          </Tooltip>
        </CardTitle>
      </CardHeader>

      <CardContent className="">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {integrations.map((details) => (
            <IntegrationCard
              key={details.provider}
              details={details}
              integration={connectedMap.get(details.provider)}
            />
          ))}
        </div>
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
    connectedIntegrations?.map((i) => [i.provider, i]) || []
  );

  return (
    <div className="space-y-6">
      <IntegrationStats connectedIntegrations={connectedIntegrations || []} />

      <div className="space-y-6">
        {Object.entries(categories).map(([categoryTitle, integrations]) => (
          <CategorySection
            key={categoryTitle}
            categoryTitle={categoryTitle}
            integrations={integrations}
            connectedMap={connectedMap}
          />
        ))}
      </div>
    </div>
  );
}
