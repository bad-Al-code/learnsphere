'use client';

import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NavItem } from '@/types';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import {
  BarChart2,
  Eye,
  HeartHandshake,
  LayoutGrid,
  LineChart,
  Presentation,
} from 'lucide-react';

const iconMap = {
  'layout-grid': LayoutGrid,
  'heart-handshake': HeartHandshake,
  'line-chart': LineChart,
  'bar-chart-2': BarChart2,
  presentation: Presentation,
  eye: Eye,
} as const;

interface DashboardTabsProps {
  tabs: NavItem[];
}

export function DashboardTabs({ tabs }: DashboardTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', value);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <TabsList>
      {tabs.map((tab) => {
        const Icon = iconMap[tab.icon as keyof typeof iconMap];
        return (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            onClick={() => handleTabChange(tab.value)}
            className="flex items-center"
          >
            {Icon && <Icon className="h-4 w-4" />}
            <span>{tab.label}</span>
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
}
