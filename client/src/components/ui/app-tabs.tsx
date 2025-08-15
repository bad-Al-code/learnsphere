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
import { Button } from './button';

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
    params.set('tab', tabValue);
    return `${basePath}?${params.toString()}`;
  };

  const getTabClassNames = () => {
    switch (device) {
      case 'mobile':
        return 'grid w-full grid-cols-6 mx-auto';
      case 'tablet':
        return 'grid w-full grid-cols-6 ';
      case 'desktop':
      default:
        return 'grid w-full grid-cols-6';
    }
  };

  return (
    <TabsList className={getTabClassNames()}>
      {tabs.map((tab) => {
        const Icon = iconMap[tab.icon];
        const href = createTabURL(tab.value);

        if (device === 'mobile' || device === 'tablet') {
          return (
            <TooltipProvider key={tab.value} delayDuration={100}>
              <Tooltip>
                <TabsTrigger value={tab.value} asChild>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(href)}
                      className="mx-auto rounded-md"
                    >
                      <Icon className="h-4 w-4" />
                    </Button>
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
          <TabsTrigger key={tab.value} value={tab.value} asChild>
            <Link
              href={href}
              className="flex items-center gap-2 whitespace-nowrap"
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
