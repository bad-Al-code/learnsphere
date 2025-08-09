'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  adminNavItems,
  instructorNavItems,
  settingsNavItems,
} from '@/config/nav-items';
import { NavItem } from '@/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarNavProps {
  type: 'settings' | 'admin' | 'instructor';
}

export function SidebarNav({ type }: SidebarNavProps) {
  const pathname = usePathname();

  const navItems: NavItem[] =
    type === 'settings'
      ? settingsNavItems
      : type === 'admin'
        ? adminNavItems
        : type === 'instructor'
          ? instructorNavItems
          : [];

  const activeTab =
    navItems
      .slice()
      .reverse()
      .find((item) => pathname.startsWith(item.href))?.value ||
    navItems[0]?.value;

  return (
    <>
      {/* Mobile: Tab Navigation */}
      <div className="mb-4 md:hidden">
        <Tabs defaultValue={activeTab} className="w-full">
          <TabsList
            className={`grid w-full`}
            style={{ gridTemplateColumns: `repeat(${navItems.length}, 1fr)` }}
          >
            {navItems.map((item) => (
              <TabsTrigger key={item.value} value={item.value} asChild>
                <Link
                  href={item.href}
                  className="flex items-center gap-1 text-xs"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Desktop: Sidebar Buttons */}
      <nav className="hidden flex-col space-y-1 md:flex">
        {navItems.map((item) => (
          <Button
            key={item.href}
            asChild
            variant={item.value === activeTab ? 'secondary' : 'ghost'}
            className="w-full justify-start gap-2"
          >
            <Link href={item.href} className="flex items-center gap-2">
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          </Button>
        ))}
      </nav>
    </>
  );
}
