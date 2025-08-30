'use client';

import { iconMap } from '@/components/shared/icons';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { DeviceType, useDevice } from '@/hooks/use-mobile';
import { NavItem } from '@/types';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

interface AppTabsProps {
  tabs: NavItem[];
  basePath: string;
  activeTab: string;
}

export function AppTabs({ tabs, basePath, activeTab }: AppTabsProps) {
  const device: DeviceType = useDevice();
  const router = useRouter();
  const searchParams = useSearchParams();

  const createTabURL = (tabValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(activeTab, tabValue);
    return `${basePath}?${params.toString()}`;
  };

  const showIconOnly =
    device === 'mobile' ||
    device === 'tablet' ||
    (device === 'desktop' && tabs.length > 8);

  const getTabClassNames = () => {
    switch (device) {
      case 'mobile':
        return 'flex w-full  mx-auto';
      case 'tablet':
        return 'flex w-full mx-auto ';
      case 'desktop':
      default:
        return 'flex w-full mx-auto ';
    }
  };

  return (
    <TabsList className="flex w-full">
      {tabs.map((tab) => {
        const Icon = iconMap[tab.icon];
        if (!Icon) return null;
        const href = createTabURL(tab.value);

        if (showIconOnly) {
          return (
            <TooltipProvider key={tab.value} delayDuration={150}>
              <Tooltip>
                <TabsTrigger value={tab.value} asChild className="flex-1">
                  <TooltipTrigger asChild>
                    <Link
                      href={href}
                      className="flex h-full w-full items-center justify-center"
                    >
                      <Icon className="h-4 w-4" />
                    </Link>
                  </TooltipTrigger>
                </TabsTrigger>
                <TooltipContent side="bottom">
                  <p>{tab.label}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        }

        return (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            asChild
            className="flex-1"
          >
            <Link
              href={href}
              className="flex items-center gap-2 px-4 whitespace-nowrap"
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </Link>
          </TabsTrigger>
        );
      })}
    </TabsList>
  );
}
