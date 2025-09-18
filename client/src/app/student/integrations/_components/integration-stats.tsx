'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Plug, TrendingUp, Zap } from 'lucide-react';
import { allIntegrations } from '../config/integrations.config';
import { PublicIntegration } from '../schema/integration.schema';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
}: StatsCardProps) {
  return (
    <Card className="border-l-primary/20 border-l-4 transition-all hover:shadow-sm">
      <CardContent className="">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <Icon className="text-primary h-5 w-5" />
              <p className="text-muted-foreground text-sm font-medium">
                {title}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-primary text-3xl font-bold">{value}</p>

              {trend && (
                <Badge
                  variant={trend.isPositive ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {trend.isPositive ? '+' : ''}
                  {trend.value}%
                </Badge>
              )}
            </div>

            {description && (
              <p className="text-muted-foreground mt-1 text-xs">
                {description}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface IntegrationStatsProps {
  connectedIntegrations: PublicIntegration[];
}

export function IntegrationStats({
  connectedIntegrations,
}: IntegrationStatsProps) {
  const stats = {
    connected: connectedIntegrations.length,
    active: connectedIntegrations.filter((i) => i.status === 'active').length,
    available: allIntegrations.length,
  };

  const connectionRate =
    stats.available > 0
      ? Math.round((stats.connected / stats.available) * 100)
      : 0;
  const activeRate =
    stats.connected > 0
      ? Math.round((stats.active / stats.connected) * 100)
      : 0;

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <StatsCard
        title="Connected Services"
        value={stats.connected}
        icon={Plug}
        description={`${connectionRate}% of available integrations`}
        trend={{
          value: connectionRate,
          isPositive: connectionRate > 50,
        }}
      />

      <StatsCard
        title="Active Integrations"
        value={stats.active}
        icon={Zap}
        description={`${activeRate}% of connected services`}
        trend={{
          value: activeRate,
          isPositive: activeRate > 75,
        }}
      />

      <StatsCard
        title="Available Services"
        value={stats.available}
        icon={TrendingUp}
        description="Total integrations offered"
      />
    </div>
  );
}
